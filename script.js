// متجّدة بسيطة في المتصفح + تحويل للـ PayPal "Buy Now"
const cart = {};
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout');

function renderCart(){
  cartItems.innerHTML = '';
  let total = 0;
  const keys = Object.keys(cart);
  if(keys.length === 0){
    cartItems.innerHTML = '<li>السلة فارغة</li>';
    checkoutBtn.disabled = true;
  } else {
    keys.forEach(id => {
      const it = cart[id];
      const li = document.createElement('li');
      li.innerHTML = `<span>${it.title} × ${it.qty}</span><span>${(it.price*it.qty).toFixed(2)} USD</span>`;
      cartItems.appendChild(li);
      total += it.price * it.qty;
    });
    checkoutBtn.disabled = false;
  }
  cartTotal.textContent = `المجموع: ${total.toFixed(2)} USD`;
}

document.querySelectorAll('.add-to-cart').forEach(btn=>{
  btn.addEventListener('click', e=>{
    const card = e.target.closest('.product');
    const id = card.dataset.id;
    const title = card.dataset.title;
    const price = parseFloat(card.dataset.price);
    if(!cart[id]) cart[id] = {title, price, qty:0};
    cart[id].qty++;
    renderCart();
  });
});

// عند الضغط على Checkout نحو PayPal
checkoutBtn.addEventListener('click', ()=>{
  const businessEmail = 'YOUR_PAYPAL_EMAIL@example.com'; // <-- غيّر هذا لبريد حساب البزنس على PayPal
  const items = Object.values(cart);
  if(items.length === 0) return alert('السلة فارغة');

  let total = items.reduce((s,it)=> s + it.price * it.qty, 0).toFixed(2);
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://www.paypal.com/cgi-bin/webscr';
  form.target = '_blank';

  form.appendChild(Object.assign(document.createElement('input'), {type:'hidden', name:'cmd', value:'_xclick'}));
  form.appendChild(Object.assign(document.createElement('input'), {type:'hidden', name:'business', value:businessEmail}));
  form.appendChild(Object.assign(document.createElement('input'), {type:'hidden', name:'item_name', value:'طلب من المتجر الإلكتروني'}));
  form.appendChild(Object.assign(document.createElement('input'), {type:'hidden', name:'amount', value:total}));
  form.appendChild(Object.assign(document.createElement('input'), {type:'hidden', name:'currency_code', value:'USD'}));
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
});