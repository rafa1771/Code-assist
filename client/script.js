import bot from './assets/bot.svg';
import codelobo from './assets/codelobo.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');
const introContainer = document.querySelector('#intro_container');
const introTextElement = document.querySelector('#intro_text');
const promptInput = document.querySelector('textarea[name="prompt"]');
const disclaimerElement = document.querySelector('.disclaimer');

const userLanguage = navigator.language;

const messages = {
  en: {
    introText: 'Welcome to CodeLoboGPT, your coding AI!',
  },
  es: {
    introText: 'Bienvenido a CodeLoboGPT, tu IA de programación!',
  },
  fr: {
    introText: 'Bienvenue sur CodeLoboGPT, votre IA de programmation !',
  },
  it: {
    introText: 'Benvenuto in CodeLoboGPT, la tua IA di programmazione!',
  },
  // Add more language messages as needed
};

const userLanguageMessages = messages[userLanguage] || messages.en;

const githubBtn = document.getElementById('githubBtn');
githubBtn.addEventListener('click', () => {
  window.open('https://github.com/rafa1771');
});


introTextElement.textContent = userLanguageMessages.introText;

introContainer.style.display = 'block';


// Multilingual placeholder

const placeholderTexts = {
  en: 'Ask CodeLoboGPT...',
  es: 'Pregunta a CodeLoboGPT...',
  fr: 'Demandez à CodeLoboGPT...',
  it: 'Chiedi a CodeLoboGPT...',
  // Add more language placeholder texts as needed
};

const userLanguagePlaceholder = placeholderTexts[userLanguage] || placeholderTexts.en;

promptInput.placeholder = userLanguagePlaceholder;

//Multilingual disclaimer texts

const disclaimerTexts = {
  en: 'CodeLoboGPT by Vizt Nivlir. May produce inaccurate or outdated information, just saying.',
  es: 'CodeLoboGPT por Vizt Nivlir. Podría dar información inexacta o desactualizada ¡Ojo al dato!',
  fr: 'CodeLoboGPT par Vizt Nivlir. Peut produire des informations inexactes ou obsolètes, juste pour info.',
  it: 'CodeLoboGPT di Vizt Nivlir. Potrebbe fornire informazioni inaccurate o obsolete, giusto per saperlo.',
  // Add more language disclaimer texts as needed
};

const userLanguageDisclaimer = disclaimerTexts[userLanguage] || disclaimerTexts.en;

disclaimerElement.textContent = userLanguageDisclaimer;

let loadInterval;

function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300)
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if(index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20)
}

function generateUniqueId() {
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timeStamp}-${hexadecimalString}`;
}

function chatStripe (isAi, value, uniqueId) {
  return (
    `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
            <img
              src="${isAi ? codelobo : user}"
              alt="${isAi ? 'codelobo' : 'user'}"
            />
          </div>
          <div class="message" id=${uniqueId}>${value}</div>
        </div>
      </div> 
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  //user's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

  // Hide the introductory field
  introContainer.style.display = 'none';

  //bot's chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  //fetch data from server -> bot's response

  const response = await fetch('https://codexgpt-h6kj.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if(response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData);
  } else {
      const err = await response.text();

      messageDiv.innerHTML = "Something went wrong.";

      alert(err);
  }
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
})