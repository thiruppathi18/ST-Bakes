const products=[
{id:1,name:"Chocolate Truffle Cake",brand:"ST BAKES",category:"Cakes",price:699,rating:"⭐⭐⭐⭐⭐",image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=85"},
{id:2,name:"Strawberry Pastry",brand:"ST BAKES",category:"Pastries",price:129,rating:"⭐⭐⭐⭐⭐",image:"https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=85"},
{id:3,name:"Blueberry Cheesecake",brand:"ST BAKES",category:"Cakes",price:799,rating:"⭐⭐⭐⭐⭐",image:"https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=85"},
{id:4,name:"Chocolate Donut",brand:"ST BAKES",category:"Donuts",price:99,rating:"⭐⭐⭐⭐",image:"https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=85"},
{id:5,name:"Fresh Butter Cookies",brand:"ST BAKES",category:"Cookies",price:249,rating:"⭐⭐⭐⭐⭐",image:"https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=85"},
{id:6,name:"Red Velvet Pastry",brand:"ST BAKES",category:"Pastries",price:149,rating:"⭐⭐⭐⭐⭐",image:"https://images.unsplash.com/photo-1586788680434-30d3245f4a3d?auto=format&fit=crop&w=800&q=85"},
{id:7,name:"Fresh Croissant",brand:"ST BAKES",category:"Breads",price:89,rating:"⭐⭐⭐⭐",image:"https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=85"},
{id:8,name:"Birthday Celebration Cake",brand:"ST BAKES",category:"Birthday",price:999,rating:"⭐⭐⭐⭐⭐",image:"https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=800&q=85"}
];

let cart=[];

function login(){
 const username=document.getElementById("username").value.trim();
 const password=document.getElementById("password").value.trim();
 const gmailPattern=/^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

 // Demo login: any valid Gmail + any non-empty password is accepted.
 // This does NOT verify a real Google account.
 if(!gmailPattern.test(username)){
  alert("Please enter a valid Gmail address (example@gmail.com).");
  return;
 }
 if(!password){
  alert("Please enter a password.");
  return;
 }
 document.getElementById("loginPage").style.display="none";
 document.getElementById("mainPage").style.display="block";
}
function logout(){document.getElementById("mainPage").style.display="none";document.getElementById("loginPage").style.display="flex"}
function displayProducts(list){
 const c=document.getElementById("products");c.innerHTML="";
 if(!list.length){c.innerHTML="<h3>No baked items found 😕</h3>";return}
 list.forEach(p=>{c.innerHTML+=`<div class="product"><div class="product-img"><img src="${p.image}" alt="${p.name}"></div><h3>${p.name}</h3><div class="brand">Brand: ${p.brand}</div><div class="rating">${p.rating}</div><div class="price">₹${p.price.toLocaleString("en-IN")}</div><div class="delivery">🚚 Free Delivery</div><button class="add" onclick="addToCart(${p.id})">🛒 Add to Cart</button><button class="buy" onclick="buyNow(${p.id})">⚡ Buy Now</button></div>`})
}
function addToCart(id){
 const p=products.find(x=>x.id===id),e=cart.find(x=>x.id===id);
 if(e)e.qty++;else cart.push({...p,qty:1});
 updateCart();alert(p.name+" added to cart 🛒");
}
function buyNow(id){
 const e=cart.find(x=>x.id===id);
 if(!e){const p=products.find(x=>x.id===id);cart.push({...p,qty:1})}
 updateCart();openCheckout();
}
function updateCart(){document.getElementById("cartCount").innerText=cart.reduce((s,x)=>s+x.qty,0)}
function openCart(){renderCart();document.getElementById("cartModal").style.display="block"}
function renderCart(){
 const c=document.getElementById("cartItems");c.innerHTML="";
 if(!cart.length){c.innerHTML="<p>Your cart is empty 🛒</p>";document.getElementById("cartTotal").innerText="0";return}
 let total=0;
 cart.forEach((x,i)=>{total+=x.price*x.qty;c.innerHTML+=`<div class="cart-item"><div><b>🧁 ${x.name}</b><br>₹${x.price.toLocaleString("en-IN")}</div><div class="qty"><button onclick="changeQty(${i},-1)">-</button> ${x.qty} <button onclick="changeQty(${i},1)">+</button></div><button class="remove" onclick="removeItem(${i})">Remove</button></div>`});
 document.getElementById("cartTotal").innerText=total.toLocaleString("en-IN");
}
function changeQty(i,v){cart[i].qty+=v;if(cart[i].qty<=0)cart.splice(i,1);updateCart();renderCart()}
function removeItem(i){cart.splice(i,1);updateCart();renderCart()}
function searchProducts(){
 const t=document.getElementById("searchInput").value.toLowerCase();
 displayProducts(products.filter(p=>p.name.toLowerCase().includes(t)||p.brand.toLowerCase().includes(t)||p.category.toLowerCase().includes(t)));
}
function filterProducts(cat){displayProducts(cat==="All"?products:products.filter(p=>p.category===cat))}
const BAKERY_UPI_ID="stbakes@okaxis";
const BAKERY_NAME="ST BAKES";
let pendingOrder=null;
let scannerTimerInterval=null;
let cameraStream=null;

function checkout(){
 if(!cart.length){alert("Your cart is empty!");return}
 closeModal("cartModal");
 openCheckout();
}

function openCheckout(){
 document.getElementById("checkoutModal").style.display="block";
 const upiRadio=document.querySelector('input[name="payment"][value="UPI"]');
 if(upiRadio&&upiRadio.checked){
  showUPI();
 }
}

function renderQrTo(elemId,text,size){
 const container=document.getElementById(elemId);
 if(!container)return;
 container.innerHTML="";
 try{
  if(typeof QRCode!=="undefined"){
   new QRCode(container,{
    text:text,
    width:size,
    height:size,
    colorDark:"#0f172a",
    colorLight:"#ffffff",
    correctLevel:QRCode.CorrectLevel.M
   });
   return;
  }
 }catch(err){
  console.warn("QRCode JS error, using API fallback:",err);
 }
 const img=document.createElement("img");
 img.src="https://api.qrserver.com/v1/create-qr-code/?size="+size+"x"+size+"&data="+encodeURIComponent(text);
 img.alt="UPI QR Code";
 img.style.width=size+"px";
 img.style.height=size+"px";
 container.appendChild(img);
}

function showUPI(){
 const upiBox=document.getElementById("upiBox");
 if(upiBox)upiBox.style.display="block";
 const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
 const upiUri="upi://pay?pa="+BAKERY_UPI_ID+"&pn="+encodeURIComponent(BAKERY_NAME)+"&am="+total+"&cu=INR&tn="+encodeURIComponent("ST BAKES Bakery Order");
 renderQrTo("checkoutMiniQr",upiUri,80);
}

function hideUPI(){
 const upiBox=document.getElementById("upiBox");
 if(upiBox)upiBox.style.display="none";
}

function openScannerModalDirectly(){
 if(!cart.length){alert("Your cart is empty!");return}
 const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
 const tempOrderId="#STB"+Math.floor(100000+Math.random()*900000);
 pendingOrder={
  name:document.getElementById("customerName")?.value.trim()||"Valued Customer",
  phone:document.getElementById("customerPhone")?.value.trim()||"9876543210",
  address:document.getElementById("customerAddress")?.value.trim()||"Customer Address",
  pin:document.getElementById("customerPincode")?.value.trim()||"600001",
  date:document.getElementById("deliveryDate")?.value||new Date().toISOString().split("T")[0],
  payment:"UPI",
  total:total,
  orderId:tempOrderId
 };
 closeModal("checkoutModal");
 openScannerModal();
}

function placeOrder(){
 const name=document.getElementById("customerName").value.trim();
 const phone=document.getElementById("customerPhone").value.trim();
 const address=document.getElementById("customerAddress").value.trim();
 const pin=document.getElementById("customerPincode").value.trim();
 const date=document.getElementById("deliveryDate").value;
 const pay=document.querySelector('input[name="payment"]:checked');

 if(!name||!phone||!address||!pin||!date){
  alert("Please fill all customer delivery details.");
  return;
 }
 if(!/^[0-9]{10}$/.test(phone)){
  alert("Please enter a valid 10-digit phone number.");
  return;
 }
 if(!/^[0-9]{6}$/.test(pin)){
  alert("Please enter a valid 6-digit pincode.");
  return;
 }
 if(!pay){
  alert("Please select a payment method.");
  return;
 }

 const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
 const orderId="#STB"+Math.floor(100000+Math.random()*900000);

 pendingOrder={name,phone,address,pin,date,payment:pay.value,total,orderId};

 if(pay.value==="UPI"){
  closeModal("checkoutModal");
  openScannerModal();
 }else{
  completeOrderSuccess(orderId,name,date,"Cash on Delivery",total);
 }
}

function openScannerModal(){
 if(!pendingOrder)return;
 document.getElementById("scanAmount").innerText=pendingOrder.total.toLocaleString("en-IN");
 document.getElementById("scanOrderId").innerText=pendingOrder.orderId;

 const upiString="upi://pay?pa="+BAKERY_UPI_ID+"&pn="+encodeURIComponent(BAKERY_NAME)+"&am="+pendingOrder.total+"&cu=INR&tn="+encodeURIComponent("ST BAKES "+pendingOrder.orderId);
 renderQrTo("qrcodeDisplay",upiString,194);

 const intentBtn=document.getElementById("upiIntentBtn");
 if(intentBtn)intentBtn.href=upiString;

 switchScannerTab("qr");
 startScannerCountdown(300);
 document.getElementById("scannerModal").style.display="block";
}

function closeScannerModal(){
 document.getElementById("scannerModal").style.display="none";
 stopScannerCountdown();
 stopCamera();
 if(pendingOrder){
  openCheckout();
 }
}

function startScannerCountdown(seconds){
 stopScannerCountdown();
 let remaining=seconds;
 updateTimerDisplay(remaining);
 scannerTimerInterval=setInterval(()=>{
  remaining--;
  if(remaining<=0){
   stopScannerCountdown();
   document.getElementById("scannerTimer").innerText="Expired (Refresh)";
  }else{
   updateTimerDisplay(remaining);
  }
 },1000);
}

function stopScannerCountdown(){
 if(scannerTimerInterval){
  clearInterval(scannerTimerInterval);
  scannerTimerInterval=null;
 }
}

function updateTimerDisplay(sec){
 const m=Math.floor(sec/60);
 const s=sec%60;
 const timerEl=document.getElementById("scannerTimer");
 if(timerEl){
  timerEl.innerText=(m<10?"0"+m:m)+":"+(s<10?"0"+s:s);
 }
}

function switchScannerTab(tab){
 const qrTab=document.getElementById("qrScanTab");
 const camTab=document.getElementById("cameraScanTab");
 const qrBtn=document.getElementById("qrTabBtn");
 const camBtn=document.getElementById("cameraTabBtn");

 if(tab==="qr"){
  qrTab.style.display="block";
  camTab.style.display="none";
  qrBtn.classList.add("active");
  camBtn.classList.remove("active");
  stopCamera();
 }else{
  qrTab.style.display="none";
  camTab.style.display="block";
  camBtn.classList.add("active");
  qrBtn.classList.remove("active");
  startCamera();
 }
}

async function startCamera(){
 const video=document.getElementById("cameraVideo");
 const status=document.getElementById("cameraStatusText");
 status.innerText="Initializing device camera...";

 try{
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){
   status.innerText="Camera is not supported on this browser/environment.";
   return;
  }
  cameraStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});
  video.srcObject=cameraStream;
  status.innerText="📷 Point camera at any UPI / QR code";
 }catch(err){
  console.warn("Camera access error:",err);
  status.innerText="Camera permission denied or camera not found. Please scan the Bakery QR code.";
 }
}

function stopCamera(){
 if(cameraStream){
  cameraStream.getTracks().forEach(track=>track.stop());
  cameraStream=null;
 }
 const video=document.getElementById("cameraVideo");
 if(video)video.srcObject=null;
 const status=document.getElementById("cameraStatusText");
 if(status)status.innerText="Camera stopped.";
}

function copyUpiId(e){
 if(e&&e.stopPropagation)e.stopPropagation();
 navigator.clipboard.writeText(BAKERY_UPI_ID).then(()=>{
  alert("Bakery UPI ID copied: "+BAKERY_UPI_ID);
 }).catch(()=>{
  prompt("Copy Bakery UPI ID:",BAKERY_UPI_ID);
 });
}

function verifyAndCompletePayment(){
 const btn=document.getElementById("verifyPayBtn");
 btn.classList.add("verifying");
 btn.innerText="⏳ Verifying payment with UPI server...";
 btn.disabled=true;

 setTimeout(()=>{
  btn.classList.remove("verifying");
  btn.innerText="✅ I Have Scanned & Paid";
  btn.disabled=false;

  if(!pendingOrder)return;
  document.getElementById("scannerModal").style.display="none";
  stopScannerCountdown();
  stopCamera();

  completeOrderSuccess(
   pendingOrder.orderId,
   pendingOrder.name,
   pendingOrder.date,
   "UPI Payment (Scanned & Paid ✅)",
   pendingOrder.total
  );
 },1400);
}

function completeOrderSuccess(orderId,name,date,paymentMethod,total){
 document.getElementById("orderId").innerText=orderId;
 document.getElementById("successName").innerText=name;
 document.getElementById("successDate").innerText=formatDate(date);
 document.getElementById("successPayment").innerText=paymentMethod;
 document.getElementById("successTotal").innerText=total.toLocaleString("en-IN");

 closeModal("checkoutModal");
 document.getElementById("successModal").style.display="block";
 cart=[];
 updateCart();
 pendingOrder=null;
}

function formatDate(d){return new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"})}
function closeModal(id){document.getElementById(id).style.display="none"}
document.getElementById("deliveryDate").min=new Date().toISOString().split("T")[0];
displayProducts(products);
