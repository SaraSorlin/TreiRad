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



document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('startGameBtn').addEventListener('click', startGame);
  document.getElementById('showHistoryBtn').addEventListener('click', showHistory);
  document.getElementById('registerBtn').addEventListener('click', registerUser);
  updatePlayerSelections();
});

