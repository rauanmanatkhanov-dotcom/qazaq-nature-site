
const menuButton = document.getElementById('menuButton');
const mainNav = document.getElementById('mainNav');

if (menuButton && mainNav) {
  menuButton.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });
}

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm && formMessage) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formMessage.textContent = 'Рақмет! Хабарламаңыз қабылданды.';
    contactForm.reset();
  });
}
