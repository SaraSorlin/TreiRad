let currentPlayer = 'X';
let player1Mark = 'X';
let player2Mark = 'O';
let player1 = '';
let player2 = '';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let movesCount = 0;
let movingPhase = false;
let selectedMarkerIndex = -1;
let gameOver = false;


function registerUser() {
  const newPlayer = document.getElementById('newPlayer').value;
  if (!newPlayer) {
    alert('Ange ett användarnamn för att registrera.');
    return;
  }

  fetchUsers().then(users => {
    if (users.some(user => user.username === newPlayer)) {
      alert('Användarnamnet är redan registrerat.');
      return;
    }

    const newUser = {
      username: newPlayer,
      matchHistory: [],
    };

    saveUser(newUser).then(() => {
      alert(`Användaren "${newPlayer}" har registrerats.`);
      updatePlayerSelections();
    });
  });
}

function saveUser(user) {
  return fetch('http://localhost:3000/users/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  }).then(response => response.json());
}

function fetchUsers() {
  return fetch('http://localhost:3000/users/')
    .then(response => response.json())
    .catch(err => console.error('Error fetching users:', err));
}

function updateUser(user) {
  return fetch(`http://localhost:3000/users/${user.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  }).then(response => response.json());
}

function updatePlayerSelections() {
  fetchUsers().then(users => {
    const player1Select = document.getElementById('player1');
    const player2Select = document.getElementById('player2');
    if (player1Select && player2Select) {
      updateSelectElement(player1Select, users);
      updateSelectElement(player2Select, users);
    }
    const userSelect = document.getElementById('userSelect');
    if (userSelect) {
      updateSelectElement(userSelect, users);
    }
  });
}

function updateSelectElement(selectElement, users) {
  selectElement.innerHTML = users.map(user =>
    `<option value="${user.username}">${user.username}</option>`
  ).join('');
}

function startGame() {
  player1 = document.getElementById('player1').value;
  player2 = document.getElementById('player2').value;
  if (!player1 || !player2 || player1 === player2) {
    alert('Välj två olika spelare för att starta spelet.');
    return;
  }
  currentPlayer = player1Mark;
  board = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  movesCount = 0;
  movingPhase = false;
  selectedMarkerIndex = -1;
  gameOver = false;
  document.getElementById('playerSelection').style.display = 'none';
  displayBoard();
  document.getElementById('moveCounter').style.display = 'block';
}

function displayBoard() {
  const boardContainer = document.getElementById('board') || document.createElement('div');
  boardContainer.id = 'board';
  boardContainer.innerHTML = '';

  board.forEach((cell, index) => {
    const cellDiv = document.createElement('div');
    cellDiv.className = 'cell';
    cellDiv.textContent = cell;
    cellDiv.addEventListener('click', function () { makeMove(index); });
    boardContainer.appendChild(cellDiv);
  });

  if (!document.getElementById('board')) {
    document.body.appendChild(boardContainer);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('startGameBtn').addEventListener('click', startGame);
  document.getElementById('showHistoryBtn').addEventListener('click', showHistory);
  document.getElementById('registerBtn').addEventListener('click', registerUser);
  updatePlayerSelections();
});

