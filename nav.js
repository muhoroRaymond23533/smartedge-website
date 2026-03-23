const pages = {
  home: 'hompage.html',
  audio: 'audio.html',
  laptops: 'laptops.html',
  smartphones: 'smartphones.html',
  accessories: 'accessories.html',
  about: 'about.html',
  cart: 'cart.html'
};

function getCart() {
  return JSON.parse(sessionStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
  sessionStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartBadge() {
  const count = getCart().reduce((sum, i) => sum + (i.qty || 1), 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
  });
}

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position:fixed;bottom:28px;right:28px;
      background:#0e1118;border:1px solid #1c1f2b;
      color:#d8d8d8;font-family:'Inter',sans-serif;
      font-size:0.82rem;font-weight:400;
      padding:12px 18px;border-radius:7px;
      box-shadow:0 6px 24px rgba(0,0,0,0.5);
      z-index:9999;opacity:0;
      transition:opacity 0.25s;
      pointer-events:none;max-width:260px;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 2200);
}

function addToCart(btn) {
  const card  = btn.closest('.card');
  const name  = card.querySelector('.card-name')?.textContent.trim() || '';
  const price = card.querySelector('.card-price')?.textContent.trim() || '';

  const cart = getCart();
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  saveCart(cart);
  updateCartBadge();

  btn.textContent = 'Added';
  btn.classList.add('added');
  setTimeout(() => {
    btn.textContent = 'Add to Cart';
    btn.classList.remove('added');
  }, 1800);

  showToast(name + ' added to cart');
}

updateCartBadge();

document.querySelectorAll('.v-sidebar li').forEach(li => {
  li.addEventListener('click', () => {
    document.querySelectorAll('.v-sidebar li').forEach(l => l.classList.remove('active'));
    li.classList.add('active');
  });
});

const searchForm  = document.querySelector('.search-bar');
const searchInput = searchForm?.querySelector('input');

if (searchForm) {
  searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const query = searchInput?.value.trim().toLowerCase();
    if (!query) return;

    const cards = document.querySelectorAll('.card');
    let found = 0;
    cards.forEach(card => {
      const name  = card.querySelector('.card-name')?.textContent.toLowerCase() || '';
      const desc  = card.querySelector('.card-desc')?.textContent.toLowerCase() || '';
      const cat   = card.querySelector('.card-cat')?.textContent.toLowerCase() || '';
      const match = name.includes(query) || desc.includes(query) || cat.includes(query);
      card.style.display = match ? '' : 'none';
      if (match) found++;
    });

    if (found === 0) {
      cards.forEach(card => { card.style.display = ''; });
      searchInput.value = '';
      searchInput.placeholder = 'Nothing matched — showing all';
      setTimeout(() => {
        searchInput.placeholder = searchInput.dataset.placeholder || 'Search...';
      }, 2500);
    }
  });

  if (searchInput) {
    searchInput.dataset.placeholder = searchInput.placeholder;
    searchInput.addEventListener('input', () => {
      if (searchInput.value === '') {
        document.querySelectorAll('.card').forEach(card => { card.style.display = ''; });
      }
    });
  }
}

const logo = document.querySelector('.logo a');
if (logo && !logo.getAttribute('href')) {
  logo.addEventListener('click', e => {
    e.preventDefault();
    window.location.href = pages.home;
  });
}

document.querySelector('a.cart')?.addEventListener('click', e => {
  e.preventDefault();
  window.location.href = pages.cart;
});
