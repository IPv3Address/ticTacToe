'use strict';
const h1 = document.querySelector('.winnerH1');
const squares = document.querySelectorAll('.square');
const container = document.querySelector('.container');

let winner = null;
const human = 'O';
const ai = 'X';
let currentPlayer = ai;
let board = Array.from(Array(9).keys());
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

function bestMove() {
  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < board.length; i++) {
    if (typeof board[i] === 'number') {
      board[i] = ai;
      let score = minimax(board, 0, false);
      board[i] = i;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  board[move] = ai;
  drawBoard(squares, board);
  currentPlayer = human;
}
let scores = {
  X: 10,
  O: -10,
  tie: 0,
};

function minimax(board, depth, maximazingPlayer) {
  let result = checkWInner(board);
  if (result !== null) {
    return scores[result];
  }

  if (maximazingPlayer) {
    let maxEval = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (typeof board[i] === 'number') {
        board[i] = ai;
        let evaluation = minimax(board, depth + 1, false);
        board[i] = i;
        maxEval = Math.max(maxEval, evaluation);
      }
    }
    return maxEval;
  } else {
    let maxEval = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (typeof board[i] === 'number') {
        board[i] = human;
        let evaluation = minimax(board, depth + 1, true);
        board[i] = i;
        maxEval = Math.min(maxEval, evaluation);
      }
    }
    return maxEval;
  }
}

function placer(e) {
  const target = e.target;
  if (target.classList.contains('square') && target.textContent === '') {
    board[target.id - 1] = human;
    drawBoard(squares, board);
  }
  currentPlayer = ai;
}

function drawBoard(squares, board) {
  squares.forEach((square, i) => {
    if (typeof board[i] !== 'number') {
      square.textContent = board[i];
    }
  });
  winner = checkWInner(board);
}

function checkWInner(board) {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  if (!board.some(element => typeof element === 'number')) {
    return 'tie';
  }
  return null;
}

function gameEnd(winner) {
  const endresult = winner === 'tie' ? 'Barazim!' : `${winner} Fiton!`;
  h1.textContent = `${endresult}`;
  h1.classList.remove('hidden');
  container.removeEventListener('click', handleClickEvents);
}
function handleClickEvents(e) {
  if (!winner) {
    placer(e);
    checkWInner(board);
    if (winner) {
      gameEnd(winner);
      return;
    }
    bestMove();
    if (winner) {
      gameEnd(winner);
    }
  }
}

container.addEventListener('click', handleClickEvents);
