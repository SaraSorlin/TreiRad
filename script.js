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



document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('startGameBtn').addEventListener('click', startGame);
  document.getElementById('showHistoryBtn').addEventListener('click', showHistory);
  document.getElementById('registerBtn').addEventListener('click', registerUser);
  updatePlayerSelections();
});

