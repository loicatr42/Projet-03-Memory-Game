const cards = Array.from(document.querySelectorAll(".card"));
const gameBoard = document.querySelector(".game-board");
const movesDisplay = document.getElementById("moves");
const restartButton = document.getElementById("restart-button");
const message = document.querySelector(".message");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;

const TOTAL_PAIRS = cards.length / 2;
const WRONG_PAIR_DELAY = 2000;

// =========================================
// MÉLANGE
// =========================================

function shuffleCards() {
  const shuffledCards = [...cards];

  for (let i = shuffledCards.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [shuffledCards[i], shuffledCards[randomIndex]] = [
      shuffledCards[randomIndex],
      shuffledCards[i],
    ];
  }

  cards.forEach((card) => {
    card.style.order = "";
  });

  shuffledCards.forEach((card) => {
    gameBoard.appendChild(card);
  });
}

// =========================================
// IDENTITÉ DE LA CARTE
// =========================================

function getCardValue(card) {
  return card.dataset.card;
}

// =========================================
// RETOURNER UNE CARTE
// =========================================

function flipCard() {
  if (lockBoard) {
    return;
  }

  if (this.classList.contains("matched")) {
    return;
  }

  if (this === firstCard) {
    return;
  }

  this.classList.add("flipped");

  if (firstCard === null) {
    firstCard = this;
    return;
  }

  secondCard = this;

  moves++;

  movesDisplay.textContent = moves;

  checkForMatch();
}

// =========================================
// VÉRIFIER LA PAIRE
// =========================================

function checkForMatch() {
  const isMatch = getCardValue(firstCard) === getCardValue(secondCard);

  if (isMatch) {
    disableMatchedCards();
  } else {
    unflipCards();
  }
}

// =========================================
// BONNE PAIRE
// =========================================

function disableMatchedCards() {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");

  matchedPairs++;

  firstCard = null;
  secondCard = null;

  lockBoard = false;

  if (matchedPairs === TOTAL_PAIRS) {
    message.textContent = `Bravo ! Tu as trouvé toutes les paires en ${moves} coups.`;

    message.classList.add("success");
  }
}

// =========================================
// MAUVAISE PAIRE
// =========================================

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");

    firstCard = null;
    secondCard = null;

    lockBoard = false;
  }, WRONG_PAIR_DELAY);
}

// =========================================
// RECOMMENCER
// =========================================

function restartGame() {
  firstCard = null;
  secondCard = null;

  lockBoard = false;

  moves = 0;
  matchedPairs = 0;

  movesDisplay.textContent = "0";

  message.textContent = "";
  message.classList.remove("success");

  cards.forEach((card) => {
    card.classList.remove("flipped", "matched");

    card.style.order = "";
  });

  shuffleCards();
}

// =========================================
// ÉVÉNEMENTS
// =========================================

cards.forEach((card) => {
  card.addEventListener("click", flipCard);
});

restartButton.addEventListener("click", restartGame);

// =========================================
// DÉMARRAGE
// =========================================

shuffleCards();
