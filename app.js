
let products = JSON.parse(localStorage.getItem("products")) || [];
let cart = [];
let sales = JSON.parse(localStorage.getItem("sales")) || [];

function saveProducts(){
localStorage.setItem("products", JSON.stringify(products));
}

function saveSales(){
localStorage.setItem("sales", JSON.stringify(sales));
}

function addProduct(){

let name=document.getElementById("name").value;
let price=parseFloat(document.getElementById("price").value);
let code=document.getElementById("code").value;

if(!name || !price){
alert("Enter product info");
return;
}

products.push({name,price,code});

saveProducts();
displayProducts();

}

function displayProducts(){

let list=document.getElementById("productList");
list.innerHTML="";

products.forEach((p,i)=>{

let li=document.createElement("li");

li.innerHTML=`
${p.name} - $${p.price}
<button onclick="addToCart(${i})">Add</button>
`;

list.appendChild(li);

});

}

function addToCart(index){

let item=products[index];

let existing=cart.find(c=>c.name===item.name);

if(existing){
existing.qty++;
}
else{
cart.push({...item,qty:1});
}

displayCart();

}

function displayCart(){

let list=document.getElementById("cartList");

list.innerHTML="";

let total=0;

cart.forEach((item,i)=>{

let subtotal=item.price*item.qty;

total+=subtotal;

let li=document.createElement("li");

li.innerHTML=`
${item.name} x${item.qty} - $${subtotal}
<button onclick="removeItem(${i})">X</button>
`;

list.appendChild(li);

});

document.getElementById("total").innerText=total.toFixed(2);

}

function removeItem(i){

cart.splice(i,1);

displayCart();

}

function barcodeScan(e){

if(e.key==="Enter"){

let code=e.target.value;

let product=products.find(p=>p.code===code);

if(product){

let index=products.indexOf(product);

addToCart(index);

}

e.target.value="";

}

}

function checkout(){

if(cart.length===0) return;

let total=cart.reduce((sum,item)=>sum+(item.price*item.qty),0);

let sale={
date:new Date().toLocaleString(),
items:cart,
total:total
};

sales.push(sale);

saveSales();

cart=[];

displayCart();

displaySales();

alert("Sale complete");

}

function displaySales(){

let list=document.getElementById("salesHistory");

list.innerHTML="";

let todayTotal=0;

let today=new Date().toDateString();

sales.forEach(s=>{

let saleDate=new Date(s.date).toDateString();

if(saleDate===today){
todayTotal+=s.total;
}

let li=document.createElement("li");

li.innerText=`${s.date} - $${s.total}`;

list.appendChild(li);

});

document.getElementById("todayRevenue").innerText=todayTotal;

}

function printReceipt(){

window.print();

}

function exportCSV(){

let csv="Date,Total\n";

sales.forEach(s=>{
csv+=`${s.date},${s.total}\n`;
});

let blob=new Blob([csv],{type:"text/csv"});

let a=document.createElement("a");

a.href=URL.createObjectURL(blob);

a.download="sales.csv";

a.click();

}

function searchProduct(){

let term=document.getElementById("search").value.toLowerCase();

let filtered=products.filter(p=>p.name.toLowerCase().includes(term));

let list=document.getElementById("productList");

list.innerHTML="";

filtered.forEach(p=>{

let index=products.indexOf(p);

let li=document.createElement("li");

li.innerHTML=`
${p.name} - $${p.price}
<button onclick="addToCart(${index})">Add</button>
`;

list.appendChild(li);

});

}

displayProducts();
displaySales();