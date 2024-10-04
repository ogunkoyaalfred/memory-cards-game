const container = document.querySelector(".grid-container");
let cards = [];
let firstCard;
let secondCard;
let lockBoard = false;
let score = 0;

document.querySelector(".score").innerText = score;

fetch("./data/cards.json")
  .then((response) => response.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
  });

const shuffleCards = () => {
  let currentIndex = cards.length, randomIndex, temporaryValue;
  
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
};

const generateCards = () => {
  for (let card of cards) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.setAttribute('data-name', card.name);
    cardElement.innerHTML = `
      <div class='front'>
        <img class='front-image' src=${card.image} />
      </div>
      <div class='back'></div>
    `;
    container.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
};

const flipCard = function () {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flipped');

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  score++;
  document.querySelector(".score").textContent = score;
  lockBoard = true;
  
  checkForMatch();
};

const checkForMatch = () => {
  if (firstCard.dataset.name === secondCard.dataset.name) {
    disableCards();
  } else {
    setTimeout(unflipCards, 1000);
  }
};

const disableCards = () => {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
};

const unflipCards = () => {
  firstCard.classList.remove("flipped");
  secondCard.classList.remove("flipped");
  resetBoard();
};

const resetBoard = () => {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
};

const restart = () => {
  resetBoard();
  shuffleCards();
  score = 0;
  document.querySelector(".score").textContent = score;
  container.innerHTML = "";
  generateCards();
};
