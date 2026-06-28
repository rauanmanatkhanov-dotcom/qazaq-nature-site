
const menuBtn = document.querySelector('.menu');
const nav = document.querySelector('.nav');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

const form = document.querySelector('#contactForm');
const msg = document.querySelector('#formMessage');

if (form && msg) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.elements.name.value.trim();
    msg.textContent = name
      ? `${name}, хабарламаңыз қабылданды. Жауап жақын уақытта беріледі.`
      : 'Хабарламаңыз қабылданды.';
    form.reset();
  });
}

const typeTarget = document.querySelector('#typeText');
if (typeTarget) {
  const text = 'Жасанды интеллект оқуға, жұмысқа және күнделікті өмірге көмектеседі.';
  let i = 0;
  const tick = () => {
    typeTarget.textContent = text.slice(0, i);
    i++;
    if (i <= text.length) setTimeout(tick, 35);
  };
  tick();
}

document.querySelectorAll('.year').forEach(el => {
  el.textContent = new Date().getFullYear();
});
