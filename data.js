const cardContent = [
  '🐶', '🐵', '🦄', '🐸', '🐷', '🐠', '🦀', '🦋', '🐼', '🐢',
  '🐬', '🐹', '🦁', '🐱', '🐭', '🐰', '🦊', '🐻', '🐨', '🐯',
  '🐮', '🐔', '🐧', '🐦', '🦆', '🐝', '🐌', '🪲', '🐞', '🦩',
  '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍓', '🍒', '🍑',
  '🍍', '🥝', '🍆', '🥑', '🌶', '🌽', '🥕', '🥒', '🥭', '🍇'
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createPairArray(array) {
  const pairArray = [];

  array.forEach(elem => {
    pairArray.push(elem);
    pairArray.push(elem);
  });

  return pairArray;
}

function createPairCardsArray(number) {
  const pairCardsArray = createPairArray( cardContent.slice(0, number) );
  shuffleArray(pairCardsArray);

  return pairCardsArray;
}

export {createPairCardsArray}
