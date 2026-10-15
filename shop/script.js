// Dynamic item rendering from JS objects
const products = [
  {id:1,name:"Wireless Headphones",price:1999,desc:"Noise cancellation with deep bass",img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300"},
  {id:2,name:"Smart Watch",price:2999,desc:"Fitness tracking & heart monitor",img:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300"},
  {id:3,name:"Gaming Mouse",price:999,desc:"RGB light with 6 programmable buttons",img:"https://images.unsplash.com/photo-1527864554321-44a1dc05d7d2?w=300"},
  {id:4,name:"Mechanical Keyboard",price:3499,desc:"Blue switches for pro typing",img:"https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=300"},
  {id:5,name:"Laptop Stand",price:799,desc:"Aluminum foldable stand",img:"https://images.unsplash.com/photo-1525598912003-663126343e1f?w=300"},
  {id:6,name:"USB-C Hub",price:1299,desc:"7-in-1 hub for all devices",img:"https://images.unsplash.com/photo-1625842268584-8f3296236761?w=300"}
];

let cart = [];

const productsEl = document.getElementById('products');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeModal = document.getElementById('closeModal');
const cartItemsEl = document.getElementById('cartItems');
const modalTotal = document.getElementById('modalTotal');

// Render products
function renderProducts(){
  productsEl.innerHTML = "";
  products.forEach(p=>{
    productsEl.innerHTML += `
      <div class="product">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="price">₹${p.price}</div>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    `;
  });
}

window.addToCart = (id)=>{
  const product = products.find(p=>p.id===id);
  const existing = cart.find(c=>c.id===id);
  if(existing){ existing.qty++; } else { cart.push({...product,qty:1}); }
  updateCart();
}

function updateCart(){
  let count = 0, total = 0;
  cart.forEach(c=>{ count+=c.qty; total+=c.price*c.qty; });
  cartCount.textContent = count;
  cartTotal.textContent = total;
  modalTotal.textContent = total;
  
  cartItemsEl.innerHTML = cart.length===0 ? "<p>Cart is empty</p>" : "";
  cart.forEach(c=>{
    cartItemsEl.innerHTML += `<div><span>${c.name} x ${c.qty}</span><span>₹${c.price*c.qty}</span></div>`;
  });
}

// Modal
cartBtn.onclick = ()=> cartModal.classList.remove('hidden');
closeModal.onclick = ()=> cartModal.classList.add('hidden');
window.onclick = (e)=>{ if(e.target===cartModal) cartModal.classList.add('hidden'); }

document.getElementById('checkoutBtn').onclick = ()=>{
  if(cart.length===0) return;
  document.getElementById('checkoutMsg').textContent = "✅ Order Placed! Thank you for shopping. Total: ₹"+modalTotal.textContent;
  cart=[]; updateCart();
  setTimeout(()=>{ cartModal.classList.add('hidden'); document.getElementById('checkoutMsg').textContent=""; },2000);
}

renderProducts();