const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

const socket = io();
socket.on('message', ({ author, date, content }) => addMessage(author, date, content));
socket.on('join', ({ name }) =>
addMessage('Chat Bot', null, name + 'has joined the chat'));

socket.on('removeUser', ({ name }) =>
  addMessage('Chat Bot', null, name + 'has left the chat'));


let userName = '';

// funtctions

function login (e) {
  e.preventDefault();

  if(userNameInput.value !== '') {
    userName = userNameInput.value;
    loginForm.classList.toggle('show');
    messagesSection.classList.add('show');
    socket.emit('join', {name: userName, id: socket.id });
  } else {
    alert('Please enter your login');
  };
};

function sendMessage(e) {
  e.preventDefault();

  let messageContent = messageContentInput.value;

  const todaysDate = new Date();
  const min = todaysDate.getMinutes().toString().padStart(2, 0);
  const hour = todaysDate.getHours().toString().padStart(2, 0);
  const date = `${hour}:${min}`

  if(!messageContent.length) {
    alert('You have to type something!');
  }
  else {
    addMessage(userName, date, messageContent);
    socket.emit('message', { author: userName, date: date, content: messageContent })
    messageContentInput.value = '';
  }
}

function addMessage(author, date, content) {

  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if(author === userName) {
   message.classList.add('message--self');
  } else if (author === 'Chat Box'){
    message.classList.add('message--chatbox');
  }
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author }</h3>
    <div class="message__content">
      ${content}
    </div>
  `;

  const time = document.createElement('div');
  time.classList.add('message--time');
  time.innerHTML = date;

  const deleteMsg = document.createElement('span');
  deleteMsg.classList.add('message--delete');
  deleteMsg.innerHTML = 'x';
  if(author === userName) {
    deleteMsg.addEventListener('click', () => message.remove());
  }

 if (author !== 'Chat Bot') {
  message.appendChild(deleteMsg); 
}
  message.appendChild(time);
  messagesList.appendChild(message);
}

// listeners

loginForm.addEventListener('submit', e => {
  login(e);
});

addMessageForm.addEventListener('submit', e => {
  sendMessage(e);
})


