
const menuBtn = document.querySelector('.menu');
const nav = document.querySelector('.nav');
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
}

document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());

const typeTarget = document.querySelector('#typeText');
if (typeTarget) {
  const text = 'Мен сұрақтарға жауап бере аламын, идея ұсынамын және ақпаратты түсіндіремін.';
  let i = 0;
  const tick = () => {
    typeTarget.textContent = text.slice(0, i);
    i++;
    if (i <= text.length) setTimeout(tick, 35);
  };
  tick();
}

const contactForm = document.querySelector('#contactForm');
const formMessage = document.querySelector('#formMessage');
if (contactForm && formMessage) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = contactForm.elements.name.value.trim();
    formMessage.textContent = name
      ? `${name}, хабарламаңыз қабылданды. Рақмет!`
      : 'Хабарламаңыз қабылданды. Рақмет!';
    contactForm.reset();
  });
}

const messages = document.querySelector('#messages');
const chatForm = document.querySelector('#chatForm');
const chatInput = document.querySelector('#chatInput');
const quickButtons = document.querySelectorAll('[data-prompt]');

const knowledge = [
  {
    keys: ['сәлем', 'салам', 'hello', 'hi', 'привет'],
    answer: 'Сәлем! Мен AI Future демо көмекшісімін. Маған жасанды интеллект, оқу, технология немесе сайт туралы сұрақ қойыңыз.'
  },
  {
    keys: ['жасанды интеллект', 'ии', 'ai', 'artificial'],
    answer: 'Жасанды интеллект немесе AI дегеніміз деректерді талдап, мәтін түсіну, сурет тану, жауап беру, жоспар құру және автоматтандыру сияқты тапсырмаларды орындайтын технология.'
  },
  {
    keys: ['chatgpt', 'чатгпт', 'чат gpt'],
    answer: 'ChatGPT сияқты жүйелер үлкен тілдік модельдерге негізделеді. Олар мәтінді түсініп, ықтимал жауапты құрастырады. Бұл сайтта соған ұқсас интерфейс жасалған, бірақ толық ақылды модель емес, оқу жобасына арналған демо нұсқа.'
  },
  {
    keys: ['пайда', 'артықшылық', 'не үшін', 'керек'],
    answer: 'AI негізгі пайдасы: уақыт үнемдеу, ақпаратты тез түсіндіру, мәтін дайындау, идея ұсыну, деректерді талдау және қайталанатын жұмысты автоматтандыру.'
  },
  {
    keys: ['қауіп', 'қауіпсіз', 'зиян', 'минус'],
    answer: 'AI қолданғанда ақпаратты тексеру керек. Жеке құпия деректерді енгізбеу, авторлық құқықты сақтау және AI жауабын толық шындық деп қабылдамау маңызды.'
  },
  {
    keys: ['оқу', 'студент', 'сабақ', 'мектеп'],
    answer: 'Оқуда AI тақырыпты түсіндіруге, жоспар жасауға, мысал келтіруге және мәтінді жақсартуға көмектеседі. Бірақ дайын жұмысты көшірмей, өз түсінігіңмен толықтырған дұрыс.'
  },
  {
    keys: ['сайт', 'жоба', 'талап'],
    answer: 'Бұл сайтта 3 беттен көп бөлім, беттер арасында мәзір, бет ішіндегі навигация, 3 сурет, форма, аудио, видео және жұмыс істейтін интерфейс бар.'
  },
  {
    keys: ['рахмет', 'спасибо'],
    answer: 'Қуаныштымын! Тағы сұрақ болса, жаза беріңіз.'
  }
];

function currentTime() {
  const now = new Date();
  return now.toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' });
}

function addMessage(text, sender) {
  if (!messages) return;
  const item = document.createElement('div');
  item.className = `message ${sender}`;
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent = sender === 'user' ? `Сіз ${currentTime()}` : `AI көмекші ${currentTime()}`;
  item.appendChild(bubble);
  item.appendChild(meta);
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}

function addTyping() {
  const item = document.createElement('div');
  item.className = 'message bot';
  item.id = 'typingMessage';
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>';
  item.appendChild(bubble);
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}

function removeTyping() {
  const typing = document.querySelector('#typingMessage');
  if (typing) typing.remove();
}

function botAnswer(question) {
  const q = question.toLowerCase();
  for (const item of knowledge) {
    if (item.keys.some(key => q.includes(key))) return item.answer;
  }
  if (q.length < 4) {
    return 'Сұрағыңызды толық жазыңыз. Мысалы: AI деген не, ChatGPT қалай жұмыс істейді немесе AI қайда қолданылады?';
  }
  return 'Бұл сұрақ бойынша қысқаша жауап: AI ақпаратты талдауға, мәтін құрастыруға және шешім ұсынуға көмектеседі. Нақтырақ сұрасаңыз, мен демо режимде түсіндіріп беремін.';
}

function submitChat(text) {
  const value = text.trim();
  if (!value) return;
  addMessage(value, 'user');
  addTyping();
  setTimeout(() => {
    removeTyping();
    addMessage(botAnswer(value), 'bot');
  }, 700 + Math.min(value.length * 12, 900));
}

if (chatForm && chatInput) {
  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submitChat(chatInput.value);
    chatInput.value = '';
  });
}

quickButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    submitChat(btn.dataset.prompt || btn.textContent);
  });
});
