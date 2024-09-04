//board object
const gameBoard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];

  function getBoard() {
    return board;
  }

  function makeMove(position, mark) {
    if (board[position] === "") {
      board[position] = mark;
      return true;
    }
    return false;
  }

  function resetBoard() {
    board = ["", "", "", "", "", "", "", "", ""];
  }

  return {
    getBoard,
    makeMove,
    resetBoard,
  };
})();

//player module fac function

const player = function (name, marker) {
  return { name, marker };
};

//game controller

const gameController = (function () {
  let players = [];
  let currentPlayerIndex = 0;
  let gameOver = false;

  const startGame = function (player1Name, player2Name) {
    gameBoard.resetBoard();
    players = [player(player1Name, "X"), player(player2Name, "O")];
    currentPlayerIndex = 0;
    gameOver = false;
    displayController.showResult(
      `Its ${players[currentPlayerIndex].name}'s turn (${players[currentPlayerIndex].marker})`
    );
  };

  //play round

  const playRound = function (index) {
    if (
      gameOver ||
      !gameBoard.makeMove(index, players[currentPlayerIndex].marker)
    ) {
      return;
    }
    if (checkWinner()) {
      gameOver = true;
      displayController.showResult(
        `${players[currentPlayerIndex].name} is the winner!`
      );
    }
    if (checkTie()) {
      gameOver = true;
      displayController.showResult("It's a tie!");
    } else {
      currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
      if (gameOver === false) {
        displayController.showResult(
          `It's ${players[currentPlayerIndex].name}'s turn (${players[currentPlayerIndex].marker})`
        );
      }
    }
  };

  //check if there is a winner
  const checkWinner = function () {
    const board = gameBoard.getBoard();
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], //rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], //diags
    ];

    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;

      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return true;
      }
    }
    return false;
  };

  //check if there is a tie
  const checkTie = function () {
    // every cell full? return true, else false
    return gameBoard.getBoard().every((cell) => cell !== "");
  };

  return {
    startGame,
    playRound,
  };
})();

//display controller

const displayController = (function () {
  const cells = document.querySelectorAll(".cell");
  const resultDisplay = document.getElementById("result");
  const restartBtn = document.getElementById("restart");
  const modal = document.getElementById("start-game-modal");
  const startGameBtn = document.getElementById("start-game-btn");

  //hide modal
  const hideModal = function () {
    modal.style.display = "none";
  };

  //start game

  startGameBtn.addEventListener("click", () => {
    const player1Name = document.getElementById("player1").value || "X";
    const player2Name = document.getElementById("player2").value || "O";
    gameController.startGame(player1Name, player2Name);

    cells.forEach((cell) => {
      cell.textContent = "";
    });

    hideModal();
  });

  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      gameController.playRound(index);
      const board = gameBoard.getBoard();
      cell.textContent = board[index];
    });
  });

  restartBtn.addEventListener("click", () => {
    modal.style.display = "flex";

    cells.forEach((cell) => {
      cell.textContent = "";
    });
  });

  const render = () => {
    const board = Gameboard.getBoard();
  };

  const showResult = (message) => {
    resultDisplay.textContent = message;
  };

  return {
    render,
    showResult,
  };
})();
