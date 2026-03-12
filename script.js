let items = []

let invoiceNumber = parseInt(localStorage.getItem("invoiceNumber")) || 1001
document.getElementById("invoiceNumber").value = invoiceNumber

let today = new Date()

let formattedDate =
("0" + today.getDate()).slice(-2) + "/" +
("0" + (today.getMonth() + 1)).slice(-2) + "/" +
today.getFullYear()

document.getElementById("billDate").value = formattedDate
function loadServices(){

let services = JSON.parse(localStorage.getItem("services")) || []

let list = document.getElementById("services")

list.innerHTML = ""

services.forEach(s => {

let option = document.createElement("option")
option.value = s.name

list.appendChild(option)

})

}



particular.addEventListener("change", () => {

let services = JSON.parse(localStorage.getItem("services")) || []

let name = particular.value

let found = services.find(s => s.name === name)

if(found){
rate.value = found.rate
}

})

function saveService(name,rate){

let services = JSON.parse(localStorage.getItem("services")) || []

if(!services.find(s => s.name === name)){
services.push({name,rate})
}

localStorage.setItem("services", JSON.stringify(services))

}

function addItem(){

let name = particular.value
let q = parseFloat(qty.value)
let r = parseFloat(rate.value)

if(!name || !q || !r){
alert("Fill all fields")
return
}

saveService(name,r)

items.push({name,q,r})

particular.value=""
qty.value=""
rate.value=""

renderTable()

}

function renderTable(){

let table = document.getElementById("billTable")

table.innerHTML = `
<tr>
<th>S.N</th>
<th>Particular</th>
<th>Qty</th>
<th>Rate</th>
<th>Amount</th>
<th>Action</th>
</tr>
`

let total = 0

items.forEach((item,i)=>{

let amount = item.q * item.r

let row = table.insertRow()

row.insertCell(0).innerText = i+1
row.insertCell(1).innerText = item.name
row.insertCell(2).innerText = item.q
row.insertCell(3).innerText = item.r
row.insertCell(4).innerText = amount

let btn = document.createElement("button")
btn.innerText = "Remove"

btn.onclick = ()=>{
items.splice(i,1)
renderTable()
}

row.insertCell(5).appendChild(btn)

total += amount

})

calculateTotals(total)

}

function calculateTotals(total){

let disc = parseFloat(discount.value) || 0
let adv = parseFloat(advance.value) || 0

let finalTotal = total - disc
let balance = finalTotal - adv

document.getElementById("total").innerText = finalTotal
document.getElementById("balance").innerText = balance

}

function generateBill(){

let customer = customerInput.value

if(items.length === 0){
alert("No items added")
return
}

let bills = JSON.parse(localStorage.getItem("bills")) || []

let bill = {
invoice: invoiceNumber,
date: billDate.value,
customer,
items,
discount: parseFloat(discount.value) || 0,
advance: parseFloat(advance.value) || 0
}

bills.push(bill)

localStorage.setItem("bills", JSON.stringify(bills))

displayInvoice(bill)

invoiceNumber++

localStorage.setItem("invoiceNumber", invoiceNumber)

document.getElementById("invoiceNumber").value = invoiceNumber

}

function displayInvoice(bill){

let html = `

<div class="shopHeader">

<h2>Multilink Digital Photo & Print</h2>

<p>Thaiba, Godavari-14</p>
<p>Contact: 9841452730 , 5560697</p>

</div>

<p><b>Invoice:</b> ${bill.invoice}</p>
<p><b>Date:</b> ${bill.date}</p>
<p><b>Customer:</b> ${bill.customer}</p>

<table>

<tr>
<th>S.N</th>
<th>Particular</th>
<th>Qty</th>
<th>Rate</th>
<th>Amount</th>
</tr>
`

let total = 0

bill.items.forEach((item,i)=>{

let amount = item.q * item.r

html += `
<tr>
<td>${i+1}</td>
<td>${item.name}</td>
<td>${item.q}</td>
<td>${item.r}</td>
<td>${amount}</td>
</tr>
`

total += amount

})

let finalTotal = total - bill.discount
let balance = finalTotal - bill.advance

html += `

</table>

<p>Subtotal Rs ${total}</p>
<p>Discount Rs ${bill.discount}</p>
<p class="totalBox">Total Rs ${finalTotal}</p>
<p>Advance Rs ${bill.advance}</p>
<p class="balanceBox">Balance Rs ${balance}</p>

`

billDisplay.innerHTML = html

}

function searchInvoice(){

let num = searchInput.value

let bills = JSON.parse(localStorage.getItem("bills")) || []

let bill = bills.find(b => b.invoice == num)

if(!bill){
alert("Invoice not found")
return
}

displayInvoice(bill)

}

function viewAllInvoices(){

let bills = JSON.parse(localStorage.getItem("bills")) || []

let html = "<table><tr><th>Invoice</th><th>Customer</th><th>Delete</th></tr>"

bills.forEach((b,i)=>{

html += `
<tr>
<td>${b.invoice}</td>
<td>${b.customer}</td>
<td><button onclick="deleteInvoice(${i})">Delete</button></td>
</tr>
`

})

html += "</table>"

invoiceList.innerHTML = html

}

function deleteInvoice(index){

let bills = JSON.parse(localStorage.getItem("bills")) || []

if(confirm("Delete this invoice?")){

bills.splice(index,1)

localStorage.setItem("bills", JSON.stringify(bills))

viewAllInvoices()

}

}

function shareBill(){

let option = prompt(
"Choose share option:\n1 = WhatsApp\n2 = Copy Text"
)

let text = billDisplay.innerText

if(option=="1"){

let url = "https://wa.me/?text=" + encodeURIComponent(text)

window.open(url)

}

if(option=="2"){

navigator.clipboard.writeText(text)

alert("Invoice copied")

}

}


function newBill(){

items = []

renderTable()

customerInput.value = ""
discount.value = 0
advance.value = 0

billDisplay.innerHTML = ""

}

