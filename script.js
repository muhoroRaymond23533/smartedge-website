const pageMap = {
  audio: 'audio.html',
  laptops: 'laptops.html',
  smartphones: 'smartphones.html',
  accessories: 'accessories.html'
};

const slideData = [
  { label: 'New Release · 2026',     title: 'AeroDrive Pro', sub: 'Peak performance engineered.' },
  { label: 'Best Seller · Audio',    title: 'SoundSphere X', sub: 'Immersive audio, redefined.' },
  { label: 'Trending · Smartphones', title: 'NovaPulse S9',  sub: 'The fastest chip ever made.' }
];

let current = 0;
let autoTimer = null;

const track     = document.getElementById('slidesTrack');
const dots      = document.querySelectorAll('.dot');
const prevBtn   = document.getElementById('prevBtn');
const nextBtn   = document.getElementById('nextBtn');
const slideNum  = document.getElementById('slideNum');
const heroLabel = document.getElementById('heroLabel');
const heroTitle = document.getElementById('heroTitle');
const heroSub   = document.getElementById('heroSub');

function goTo(index) {
  if (index < 0) index = slideData.length - 1;
  if (index >= slideData.length) index = 0;
  current = index;
  track.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
  if (slideNum)  slideNum.textContent  = String(current + 1).padStart(2, '0');
  if (heroLabel) heroLabel.textContent = slideData[current].label;
  if (heroTitle) heroTitle.textContent = slideData[current].title;
  if (heroSub)   heroSub.textContent   = slideData[current].sub;
}

function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 5000); }
function resetAuto()  { clearInterval(autoTimer); startAuto(); }

if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
dots.forEach(dot => {
  dot.addEventListener('click', () => { goTo(parseInt(dot.dataset.index)); resetAuto(); });
});
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { goTo(current + 1); resetAuto(); }
  if (e.key === 'ArrowLeft')  { goTo(current - 1); resetAuto(); }
});
if (track) {
  let touchStart = 0;
  track.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
  });
}
goTo(0);
startAuto();

function getCart() { return JSON.parse(sessionStorage.getItem('cart') || '[]'); }
function saveCart(c) { sessionStorage.setItem('cart', JSON.stringify(c)); }

function updateCartBadge() {
  const count = getCart().reduce((sum, i) => sum + (i.qty || 1), 0);
  document.querySelectorAll('.cart-count').forEach(el => { el.textContent = count; });
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

document.querySelectorAll('.sidebar li').forEach(li => {
  li.addEventListener('click', () => {
    document.querySelectorAll('.sidebar li').forEach(l => l.classList.remove('active'));
    li.classList.add('active');
    const label = li.querySelector('a').textContent.trim().toLowerCase();
    const target = pageMap[label];
    if (target) setTimeout(() => { window.location.href = target; }, 150);
  });
});

const searchForm  = document.querySelector('.search-bar');
const searchInput = searchForm?.querySelector('input');
if (searchForm) {
  searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const query = searchInput?.value.trim().toLowerCase();
    if (!query) return;
    const match = Object.keys(pageMap).find(key => query.includes(key));
    if (match) {
      window.location.href = pageMap[match];
    } else {
      searchInput.value = '';
      searchInput.placeholder = 'No results found';
      setTimeout(() => { searchInput.placeholder = 'Search gadgets...'; }, 2000);
    }
  });
}

document.querySelector('a.cart')?.addEventListener('click', e => {
  e.preventDefault();
  window.location.href = 'cart.html';
});

const hoverSound = document.getElementById('hoverSound');
if (hoverSound) {
  hoverSound.volume = 0.08;
  document.querySelectorAll('.sidebar li').forEach(item => {
    item.addEventListener('mouseenter', () => {
      hoverSound.currentTime = 0;
      hoverSound.play().catch(() => {});
    });
  });
}
