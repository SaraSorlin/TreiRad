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

function makeMove(index) {
  if (!gameActive || gameOver) return;

  if (movingPhase) {
    if (selectedMarkerIndex === -1 && board[index] === currentPlayer) {
      selectMarkerToMove(index);
    } else if (board[index] === '' && selectedMarkerIndex !== -1) {
      board[selectedMarkerIndex] = '';
      board[index] = currentPlayer;
      selectedMarkerIndex = -1;
      movesCount++;
      currentPlayer = currentPlayer === player1Mark ? player2Mark : player1Mark;
    }
  } else {
    if (board[index] === '') {
      board[index] = currentPlayer;
      movesCount++;
      if (currentPlayer === player2Mark && movesCount === 6) {
        movingPhase = true;
      }
      currentPlayer = currentPlayer === player1Mark ? player2Mark : player1Mark;
    }
  }

  updateBoard();
  if (!gameOver) {
    checkForWinner();
  }
  displayBoard();
  document.getElementById('moveCounter').textContent = 'Antal drag: ' + movesCount;
}

function checkForWinner() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      gameActive = false;
      gameOver = true;
      const winnerMark = board[a];
      const winner = winnerMark === player1Mark ? player1 : player2;
      setTimeout(() => alert(`Spelare ${winner} vinner!`), 10);
      saveMatchResult(winner, movesCount);
      return;
    }
  }

  let roundDraw = !board.includes('');
  if (roundDraw) {
    gameActive = false;
    gameOver = true;
    setTimeout(() => alert('Spelet är oavgjort!'), 10);
    saveMatchResult('Ingen', movesCount);
    return;
  }
}

function updateBoard() {
  const cells = document.querySelectorAll('#board .cell');
  cells.forEach((cell, index) => {
    cell.textContent = board[index];
    checkForWinner();
  });
}

function hasPlacedThreeMarkers(playerMark) {
  return board.filter(mark => mark === playerMark).length === 3;
}

function selectMarkerToMove(index) {
  if (board[index] === currentPlayer) {
    selectedMarkerIndex = index;
  }
}

function saveMatchResult(winner, moves) {
  fetchUsers().then(users => {
    const user1 = users.find(user => user.username === player1);
    const user2 = users.find(user => user.username === player2);
    if (user1 && user2) {
      const matchResult = {
        player1: player1,
        player2: player2,
        winner: winner,
        moves: moves,
      };
      user1.matchHistory = [...(user1.matchHistory || []), matchResult];
      user2.matchHistory = [...(user2.matchHistory || []), matchResult];

      Promise.all([updateUser(user1), updateUser(user2)])
        .then(() => console.log("Matchhistoriken uppdaterad"))
        .catch(err => console.error("Fel vid uppdatering av matchhistorik", err));
    }
  });
}


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('startGameBtn').addEventListener('click', startGame);
  document.getElementById('showHistoryBtn').addEventListener('click', showHistory);
  document.getElementById('registerBtn').addEventListener('click', registerUser);
  updatePlayerSelections();
});

