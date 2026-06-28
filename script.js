
const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav');
if (menu && nav) menu.addEventListener('click', () => nav.classList.toggle('open'));

document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());

const typeText = document.querySelector('#typeText');
if (typeText) {
  const text = 'Каталог, AI ұсыныс, себет, калькулятор және сатушы панелі бір сайтта.';
  let i = 0;
  const tick = () => {
    typeText.textContent = text.slice(0, i);
    i++;
    if (i <= text.length) setTimeout(tick, 35);
  };
  tick();
}

const products = [
  {id:1, name:'Смартфон X Pro 256GB', cat:'electronics', price:329990, icon:'📱', rating:4.9, tags:['техника','сыйлық','жұмыс']},
  {id:2, name:'Беспроводные наушники Air Sound', cat:'electronics', price:24990, icon:'🎧', rating:4.7, tags:['музыка','спорт','сыйлық']},
  {id:3, name:'Женская сумка Urban Style', cat:'fashion', price:18990, icon:'👜', rating:4.8, tags:['стиль','қыздарға','күнделікті']},
  {id:4, name:'Кроссовки Training Flex', cat:'fashion', price:31990, icon:'👟', rating:4.6, tags:['спорт','зал','жүру']},
  {id:5, name:'Кофеварка Home Barista', cat:'home', price:45990, icon:'☕', rating:4.8, tags:['үй','ас үй','сыйлық']},
  {id:6, name:'Органайзер для косметики', cat:'home', price:7990, icon:'🧴', rating:4.5, tags:['үй','қыздарға','сақтау']},
  {id:7, name:'Детский конструктор Smart Blocks', cat:'kids', price:12990, icon:'🧸', rating:4.9, tags:['балалар','оқу','сыйлық']},
  {id:8, name:'Рюкзак School Max', cat:'kids', price:15990, icon:'🎒', rating:4.6, tags:['мектеп','балалар','күнделікті']},
  {id:9, name:'Фитнес браслет Health Band', cat:'electronics', price:19990, icon:'⌚', rating:4.7, tags:['спорт','денсаулық','сыйлық']}
];

let cart = [];

function money(n) {
  return new Intl.NumberFormat('ru-RU').format(Math.round(n)) + ' ₸';
}

function renderCatalog() {
  const grid = document.querySelector('#catalogGrid');
  if (!grid) return;
  const q = (document.querySelector('#searchInput')?.value || '').toLowerCase();
  const cat = document.querySelector('#categoryFilter')?.value || 'all';
  const sort = document.querySelector('#sortFilter')?.value || 'popular';
  let list = products.filter(p => {
    const okQ = p.name.toLowerCase().includes(q) || p.tags.join(' ').toLowerCase().includes(q);
    const okC = cat === 'all' || p.cat === cat;
    return okQ && okC;
  });
  if (sort === 'cheap') list.sort((a,b) => a.price - b.price);
  if (sort === 'expensive') list.sort((a,b) => b.price - a.price);
  if (sort === 'rating') list.sort((a,b) => b.rating - a.rating);
  grid.innerHTML = list.map(p => `
    <article class="product">
      <div class="product-img">${p.icon}</div>
      <div class="product-body">
        <span class="tag">${labelCat(p.cat)}</span>
        <h3>${p.name}</h3>
        <div class="price">${money(p.price)}</div>
        <p>Рейтинг: ${p.rating} • ${p.tags.join(', ')}</p>
        <div class="product-actions">
          <button class="small-btn buy" onclick="addToCart(${p.id})">Себетке</button>
          <button class="small-btn" onclick="quickAi('${p.name}')">AI кеңес</button>
        </div>
      </div>
    </article>
  `).join('') || '<div class="panel"><h3>Тауар табылмады</h3><p>Іздеу сөзін өзгертіп көріңіз.</p></div>';
}
function labelCat(cat) {
  return {electronics:'Электроника', fashion:'Сән', home:'Үй', kids:'Балалар'}[cat] || cat;
}
['searchInput','categoryFilter','sortFilter'].forEach(id => {
  const el = document.querySelector('#' + id);
  if (el) el.addEventListener('input', renderCatalog);
});
renderCatalog();

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  cart.push(product);
  renderCart();
}
function renderCart() {
  const panel = document.querySelector('#cartPanel');
  const list = document.querySelector('#cartList');
  const total = document.querySelector('#cartTotal');
  const count = document.querySelector('#cartCount');
  if (!panel || !list || !total || !count) return;
  panel.classList.remove('hidden');
  count.textContent = cart.length;
  list.innerHTML = cart.map((p, index) => `
    <div class="cart-item">
      <span>${p.icon} ${p.name}</span>
      <button class="small-btn" onclick="removeCart(${index})">×</button>
    </div>
  `).join('');
  total.textContent = money(cart.reduce((s,p) => s + p.price, 0));
}
function removeCart(index) {
  cart.splice(index, 1);
  renderCart();
}
function clearCart() {
  cart = [];
  renderCart();
}

function quickAi(name) {
  localStorage.setItem('aiProductName', name);
  window.location.href = 'ai.html';
}

function aiRecommend() {
  const result = document.querySelector('#aiResult');
  if (!result) return;
  const purpose = document.querySelector('#purpose')?.value || '';
  const budget = Number(document.querySelector('#budget')?.value || 0);
  const person = document.querySelector('#person')?.value || '';
  const priority = document.querySelector('#priority')?.value || '';
  let candidates = products.filter(p => !budget || p.price <= budget);
  if (purpose === 'gift') candidates = candidates.filter(p => p.tags.includes('сыйлық'));
  if (purpose === 'sport') candidates = candidates.filter(p => p.tags.includes('спорт') || p.tags.includes('зал'));
  if (purpose === 'home') candidates = candidates.filter(p => p.tags.includes('үй') || p.cat === 'home');
  if (person === 'child') candidates = candidates.filter(p => p.cat === 'kids' || p.tags.includes('балалар'));
  if (person === 'girl') candidates = candidates.filter(p => p.tags.includes('қыздарға') || p.cat === 'fashion');
  if (!candidates.length) candidates = products.slice();
  candidates = candidates.map(p => {
    let score = 60;
    if (budget && p.price <= budget) score += 10;
    if (purpose && p.tags.join(' ').includes(purpose)) score += 5;
    if (priority === 'rating') score += Math.round(p.rating * 5);
    if (priority === 'cheap') score += Math.max(0, 20 - Math.round(p.price / 20000));
    if (priority === 'popular') score += Math.round(p.rating * 4);
    return {...p, score: Math.min(98, score)};
  }).sort((a,b) => b.score - a.score).slice(0,3);
  result.innerHTML = `
    <h3>AI ұсынысы дайын</h3>
    <p>Сіздің таңдауыңызға ең сәйкес келетін 3 тауар:</p>
    ${candidates.map(p => `
      <div class="result-card">
        <h3>${p.icon} ${p.name}</h3>
        <p>Бағасы: ${money(p.price)} • Рейтинг: ${p.rating}</p>
        <p><b>Неге сәйкес:</b> ${makeReason(p, purpose, person, priority)}</p>
        <div class="score"><span style="width:${p.score}%"></span></div>
        <p>Сәйкестік: ${p.score}%</p>
      </div>
    `).join('')}
  `;
}
function makeReason(p, purpose, person, priority) {
  const reasons = [];
  if (purpose === 'gift') reasons.push('сыйлыққа лайық');
  if (purpose === 'sport') reasons.push('спорт және белсенді қолдануға ыңғайлы');
  if (purpose === 'home') reasons.push('үйге пайдалы');
  if (person === 'child') reasons.push('балаларға сәйкес');
  if (person === 'girl') reasons.push('стильді және күнделікті қолдануға болады');
  if (priority === 'cheap') reasons.push('баға жағынан тиімді');
  if (priority === 'rating') reasons.push('рейтингі жоғары');
  if (!reasons.length) reasons.push('жалпы сұранысқа жақсы сәйкес келеді');
  return reasons.join(', ') + '.';
}

const aiBtn = document.querySelector('#aiBtn');
if (aiBtn) aiBtn.addEventListener('click', aiRecommend);

const aiName = localStorage.getItem('aiProductName');
if (aiName && document.querySelector('#aiResult')) {
  document.querySelector('#aiResult').innerHTML = `<h3>Каталогтан таңдалған тауар</h3><p>${aiName}</p><p>Төмендегі параметрлерді толтырып, AI ұсынысын алыңыз.</p>`;
  localStorage.removeItem('aiProductName');
}

function calcPrice() {
  const cost = Number(document.querySelector('#cost')?.value || 0);
  const margin = Number(document.querySelector('#margin')?.value || 0);
  const commission = Number(document.querySelector('#commission')?.value || 0);
  const logistics = Number(document.querySelector('#logistics')?.value || 0);
  const finalPrice = cost * (1 + margin / 100) + logistics;
  const commissionSum = finalPrice * commission / 100;
  const profit = finalPrice - cost - logistics - commissionSum;
  const out = document.querySelector('#priceResult');
  if (out) out.innerHTML = `Баға: ${money(finalPrice)}<br>Комиссия: ${money(commissionSum)}<br>Пайда: ${money(profit)}`;
}
['cost','margin','commission','logistics'].forEach(id => {
  const el = document.querySelector('#' + id);
  if (el) el.addEventListener('input', calcPrice);
});
calcPrice();

function calcLogistics() {
  const l = Number(document.querySelector('#length')?.value || 0);
  const w = Number(document.querySelector('#width')?.value || 0);
  const h = Number(document.querySelector('#height')?.value || 0);
  const coef = Number(document.querySelector('#warehouse')?.value || 1);
  const liters = l*w*h/1000;
  const base = liters <= 1 ? 46 : 46 + (liters - 1) * 14;
  const cost = base * coef;
  const out = document.querySelector('#logisticResult');
  if (out) out.innerHTML = `Көлем: ${liters.toFixed(2)} л<br>Логистика бағасы: ${money(cost)}<br>${l+w+h > 199 ? 'Ескерту: сумма сторон 199 см-ден жоғары.' : 'Габарит қалыпты.'}`;
}
['length','width','height','warehouse'].forEach(id => {
  const el = document.querySelector('#' + id);
  if (el) el.addEventListener('input', calcLogistics);
});
calcLogistics();

function generateTitle() {
  const product = document.querySelector('#seoProduct')?.value.trim() || 'Товар';
  const model = document.querySelector('#seoModel')?.value.trim();
  const feature = document.querySelector('#seoFeature')?.value.trim();
  let title = product;
  if (model) title += ' ' + model;
  if (feature) title += ' ' + feature;
  title = title.replace(/[,;®™]/g, '').slice(0, 60);
  const out = document.querySelector('#seoResult');
  if (out) out.textContent = title;
}
['seoProduct','seoModel','seoFeature'].forEach(id => {
  const el = document.querySelector('#' + id);
  if (el) el.addEventListener('input', generateTitle);
});
generateTitle();

const contactForm = document.querySelector('#contactForm');
const formMessage = document.querySelector('#formMessage');
if (contactForm && formMessage) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = contactForm.elements.name.value.trim();
    formMessage.textContent = name ? `${name}, хабарламаңыз қабылданды. Рақмет!` : 'Хабарлама қабылданды.';
    contactForm.reset();
  });
}
