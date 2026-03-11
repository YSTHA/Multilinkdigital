let invoiceCounter = localStorage.getItem("invoiceCounter") || 1001
let items = []
let total = 0
let viewMode = false

const dashboard = document.getElementById("invoiceDashboard")
const toggleBtn = document.getElementById("toggleDashboardBtn")
let dashboardVisible = false

toggleBtn.addEventListener("click", ()=>{
  if(dashboardVisible){
    dashboard.style.maxHeight = "0"
    dashboardVisible = false
  } else {
    showAllBills()
    dashboard.style.maxHeight = dashboard.scrollHeight + "px"
    dashboardVisible = true
  }
})

// Add item
function addItem(){
  if(viewMode){ alert("Saved invoices cannot be edited"); return }

  let photoNumber = document.getElementById("photoNumber").value
  let product = document.getElementById("product").value
  let price = parseFloat(document.getElementById("price").value)

  if(!photoNumber || !product || !price){ alert("Please fill all fields"); return }

  items.push({photoNumber, product, price})
  document.getElementById("photoNumber").value=""
  document.getElementById("product").value=""
  document.getElementById("price").value=""

  document.getElementById("message").innerText="Item added successfully!"
  setTimeout(()=>{document.getElementById("message").innerText=""},2000)
  generateBill(false)
}

// Generate bill
function generateBill(save=true){
  let table = document.getElementById("billTable")
  table.innerHTML = `
    <tr>
      <th>Photo Number</th>
      <th>Service</th>
      <th>Price</th>
      <th>Action</th>
    </tr>
  `

  total = 0
  items.forEach((item,index)=>{
    let row = table.insertRow()
    row.insertCell(0).innerText = item.photoNumber
    row.insertCell(1).innerText = item.product
    row.insertCell(2).innerText = "$"+item.price.toFixed(2)

    let removeBtn = document.createElement("button")
    removeBtn.innerText = "Remove"
    if(!viewMode){
      removeBtn.onclick = ()=>{ items.splice(index,1); generateBill(false) }
    } else { removeBtn.disabled = true }

    row.insertCell(3).appendChild(removeBtn)
    total += item.price
  })

  let name = document.getElementById("customer").value
  let today = new Date().toLocaleDateString()

  document.getElementById("invoiceNumber").innerText="Invoice #: "+invoiceCounter
  document.getElementById("billDate").innerText="Date: "+today
  document.getElementById("billCustomer").innerText="Customer: "+name
  document.getElementById("total").innerText="Total: $"+total.toFixed(2)

  if(save && !viewMode){
    saveBill(name,today)
    invoiceCounter++
    localStorage.setItem("invoiceCounter",invoiceCounter)
    items=[]
  }
}

// Save bill
function saveBill(name,today){
  let savedBills = JSON.parse(localStorage.getItem("bills")) || []
  savedBills.push({invoice: invoiceCounter, customer: name, date: today, items, total})
  localStorage.setItem("bills", JSON.stringify(savedBills))
}

// Share
function shareBill(){
  let name = document.getElementById("customer").value
  let totalText = document.getElementById("total").innerText
  let invoice = document.getElementById("invoiceNumber").innerText
  let message = `Multilink Digital Studio\n\n${invoice}\nCustomer: ${name}\n${totalText}`

  if(navigator.share){
    navigator.share({title:"Invoice", text: message})
  } else {
    window.open("https://wa.me/?text="+encodeURIComponent(message))
  }
}

// Search
function searchBill(){
  let invoiceSearch = document.getElementById("searchInvoice").value
  let bills = JSON.parse(localStorage.getItem("bills")) || []
  let bill = bills.find(b => b.invoice == invoiceSearch)
  if(!bill){ alert("Bill not found"); return }

  items = bill.items
  invoiceCounter = bill.invoice
  viewMode = true
  document.getElementById("customer").value = bill.customer
  generateBill(false)
}

// New invoice
function newInvoice(){
  items=[]
  total=0
  viewMode=false
  document.getElementById("customer").value=""
  document.getElementById("photoNumber").value=""
  document.getElementById("product").value=""
  document.getElementById("price").value=""
  document.getElementById("billTable").innerHTML=`
    <tr>
      <th>Photo Number</th>
      <th>Service</th>
      <th>Price</th>
      <th>Action</th>
    </tr>`
  document.getElementById("invoiceNumber").innerText=""
  document.getElementById("billDate").innerText=""
  document.getElementById("billCustomer").innerText=""
  document.getElementById("total").innerText=""
}

// Show all invoices
function showAllBills(){
  let bills = JSON.parse(localStorage.getItem("bills")) || []
  dashboard.innerHTML=`<h3>All Invoices</h3><table>
    <tr><th>Invoice</th><th>Customer</th><th>Date</th><th>Total</th><th>Action</th></tr>
  </table>`
  let table = dashboard.querySelector("table")

  bills.forEach((bill,index)=>{
    let row = table.insertRow()
    row.insertCell(0).innerText = bill.invoice
    row.insertCell(1).innerText = bill.customer
    row.insertCell(2).innerText = bill.date
    row.insertCell(3).innerText = "$"+bill.total.toFixed(2)

    let actionCell = row.insertCell(4)

    let viewBtn = document.createElement("button")
    viewBtn.innerText = "View"
    viewBtn.onclick = ()=>{
      items=bill.items
      invoiceCounter=bill.invoice
      viewMode=true
      document.getElementById("customer").value=bill.customer
      generateBill(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    let deleteBtn = document.createElement("button")
    deleteBtn.innerText="Delete"
    deleteBtn.onclick = ()=>{
      if(confirm("Delete this invoice?")){
        bills.splice(index,1)
        localStorage.setItem("bills",JSON.stringify(bills))
        showAllBills()
      }
    }

    actionCell.appendChild(viewBtn)
    actionCell.appendChild(deleteBtn)
  })
}