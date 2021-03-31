import {getEvenValue, refreshTimer, refreshStepCounterField, refreshOpenedPairsCounterField, removeChildren} from './common-utils.js';
import {createPairCardsArray} from './data.js';

let horizontalCards = 4;
let verticalCards = 4;
let pairCards = horizontalCards * verticalCards / 2;
let openedPairsCounter = 0;
let openedPairsCounterField;
let stepCounter = 0;
let stepCounterField;
let isGameActive = false;
let cardsList;
let firstCard = null;
let secondCard = null;
let timerValue = 60;
let timerField;
let timerID;
let overlay;

function createAppGame(container) {
  const controls = createControls();
  cardsList = createCardsList();
  overlay = createOverlay();

  container.append(controls);
  container.append(cardsList);
  container.append(overlay);
}

function createCardsList() {
  const cardsList = document.createElement('ul');
  cardsList.classList.add('app-game__cards-list');
  return cardsList;
}

function createCard(content) {
  const card = document.createElement('li');

  card.classList.add('app-game__card');
  card.dataset.content = content;

  card.addEventListener('click', function() {

    if (isGameActive &&
        firstCard === null &&
        secondCard === null &&
        !this.classList.contains('app-game__card--open')
        ) {
      openCard(this);
      firstCard = this;
    } else if (isGameActive &&
               firstCard !== null &&
               secondCard === null &&
               !this.classList.contains('app-game__card--open')
               ) {
      openCard(this);
      secondCard = this;

      compareCards(firstCard, secondCard);
      refreshStepCounterField(stepCounterField, ++stepCounter);
      refreshOpenedPairsCounterField(openedPairsCounterField, openedPairsCounter, pairCards);

      if (openedPairsCounter === pairCards) {
        stopGame();
      }
    }
  })

  return card;
}

function createControls() {
  const form = document.createElement('form');
  const inputHorizontal = createInput('По горизонтали', 'четные от 2 до 10');
  const inputVertical = createInput('По вертикали', 'четные от 2 до 10');
  const button = document.createElement('button');

  inputHorizontal.inputElem.value = horizontalCards;
  inputHorizontal.inputElem.addEventListener('change', function() {
    horizontalCards = getEvenValue(this, 2, 10, 4);
    this.value = horizontalCards;
    pairCards = horizontalCards * verticalCards / 2;

    refreshOpenedPairsCounterField(openedPairsCounterField, openedPairsCounter, pairCards);
  });

  inputVertical.inputElem.value = verticalCards;
  inputVertical.inputElem.addEventListener('change', function() {
    verticalCards = getEvenValue(this, 2, 10, 4);
    this.value = verticalCards;
    pairCards = horizontalCards * verticalCards / 2;

    refreshOpenedPairsCounterField(openedPairsCounterField, openedPairsCounter, pairCards);
  });

  stepCounterField = document.createElement('div');
  stepCounterField.classList.add('app-game__step-counter');
  refreshStepCounterField(stepCounterField, stepCounter);

  openedPairsCounterField = document.createElement('div');
  openedPairsCounterField.classList.add('app-game__step-counter');
  refreshOpenedPairsCounterField(openedPairsCounterField, openedPairsCounter, pairCards);

  timerField = document.createElement('div');
  timerField.classList.add('app-game__timer');
  refreshTimer(timerField, timerValue);

  button.setAttribute('type', 'submit');
  button.classList.add('app-game__button');
  button.textContent = 'Начать игру';

  form.classList.add('app-game__cotrols');
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    startGame();
  });

  form.append(inputHorizontal.labelElem);
  form.append(inputVertical.labelElem);
  form.append(stepCounterField);
  form.append(openedPairsCounterField);
  form.append(timerField);
  form.append(button);

  return form;
}

function createInput(label, title) {
  const labelElem = document.createElement('label');
  const inputElem = document.createElement('input');

  labelElem.classList.add('app-game__label');
  labelElem.textContent = label;
  labelElem.append(inputElem);

  inputElem.title = title;
  inputElem.classList.add('app-game__input');

  return {
    labelElem,
    inputElem
  };
}

function createOverlay() {
  const overlay = document.createElement('div');
  const repeatButton = document.createElement('button');
  const cancelButton = document.createElement('button');

  overlay.classList.add('app-game__overlay');

  repeatButton.classList.add('app-game__button');
  repeatButton.textContent = 'Начать заново';
  repeatButton.addEventListener('click', () => {
    overlay.classList.remove('app-game__overlay--active');
    startGame();
  });

  cancelButton.classList.add('app-game__button');
  cancelButton.textContent = 'Закончить';
  cancelButton.addEventListener('click', () => {
    overlay.classList.remove('app-game__overlay--active');
    clearGame();
  });

  overlay.append(repeatButton);
  overlay.append(cancelButton);

  return overlay;
}

function startGame() {
  isGameActive = true;
  clearGame();

  pairCards = horizontalCards * verticalCards / 2;
  cardsList.setAttribute('style', `--columns: ${horizontalCards}; --rows: ${verticalCards}`);
  addCards( cardsList, createPairCardsArray(pairCards) );
  timerID = setInterval(timer, 1000);
}

function clearGame() {
  stepCounter = 0;
  openedPairsCounter = 0;
  timerValue = 60;

  clearInterval(timerID);
  removeChildren(cardsList);
  refreshTimer(timerField, timerValue);
  refreshStepCounterField(stepCounterField, stepCounter);
  refreshOpenedPairsCounterField(openedPairsCounterField, openedPairsCounter, pairCards);
  cardsList.removeAttribute('style');
}

function stopGame() {
  isGameActive = false;
  clearInterval(timerID);
  overlay.classList.add('app-game__overlay--active');
}

function addCards(cardsList, cards) {
  cards.forEach(elem => {
    const card = createCard(elem);
    cardsList.append(card);
  });
}

function compareCards(card1, card2) {
  if (card1.dataset.content === card2.dataset.content) {
    setCardRight(card1);
    setCardRight(card2);
    ++openedPairsCounter;

    let delay1;
    let delay2;

    clearTimeout(delay1);
    clearTimeout(delay2);
    delay1 = setTimeout(setCardOpened, 700, card1);
    delay2 = setTimeout(setCardOpened, 700, card2);
  } else {
    setCardWrong(card1);
    setCardWrong(card2);

    let delay1;
    let delay2;

    clearTimeout(delay1);
    clearTimeout(delay2);
    delay1 = setTimeout(closeCard, 700, card1);
    delay2 = setTimeout(closeCard, 700, card2);
  }
}

function openCard(card) {
  card.classList.add('app-game__card--open', 'app-game__card--checked');
}

function closeCard(card) {
  card.classList.remove('app-game__card--open', 'app-game__card--checked', 'app-game__card--wrong');

  firstCard = null;
  secondCard = null;
}

function setCardRight(card) {
  card.classList.add('app-game__card--right');
}

function setCardWrong(card) {
  card.classList.add('app-game__card--wrong');
}

function setCardOpened(card) {
  card.classList.remove('app-game__card--checked', 'app-game__card--right');

  firstCard = null;
  secondCard = null;
}

function timer() {
  refreshTimer(timerField, timerValue);
  --timerValue;

  if (timerValue < 0) {
    stopGame();
  }
}

export {createAppGame}
