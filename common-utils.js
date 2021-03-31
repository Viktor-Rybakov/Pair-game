function refreshTimer(field, value) {
  field.textContent = value;

  if (value < 10) {
    field.classList.add('app-game__timer--warning');
  } else {
    field.classList.remove('app-game__timer--warning');
  }
}

function refreshStepCounterField(field, counter) {
  field.textContent = `Шаги: ${counter}`;
}

function refreshOpenedPairsCounterField(field, pairs, totalPairs) {
  field.textContent = `Открыто ${pairs} из ${totalPairs} пар`;
}

function removeChildren(elem) {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
}

function getEvenValue(input, min, max, defaultValue = 4) {
  const value = parseFloat(input.value);

  if (value >= min && value <= max && value % 2 === 0) {
    return value;
  } else {
    return parseFloat(defaultValue);
  }
}

export {getEvenValue, refreshTimer, refreshStepCounterField, refreshOpenedPairsCounterField, removeChildren}
