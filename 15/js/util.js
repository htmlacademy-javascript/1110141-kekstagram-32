/**
 * Получает случайное число из диапазона
 * @param {number} a - Минимальное значение диапазона случайных чисел
 * @param {number} b - Максимальное значение диапазона случайных чисел
 * @returns {int} result - Случайное число из диапазона
 */
function getRandomInteger (a, b) {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
}

/**
 * Получает случайное уникальное число из указанного диапазона
 * @param {number} min - Минимальное значение диапазона случайных чисел
 * @param {number} max - Максимальное значение диапазона случайных чисел
 * @returns {int} newUniqueNumber - Случайное уникальное число из диапазона
 */

function getRandomUniqueNumberFromRange (min = 1, max = 25) {
  const previousUniqueNumbersArray = [];

  return function () {
    let newUniqueNumber = getRandomInteger(min, max);
    if (previousUniqueNumbersArray.length >= (max - min + 1)) {
      return null;
    }
    while (previousUniqueNumbersArray.includes(newUniqueNumber)) {
      newUniqueNumber = getRandomInteger(min, max);
    }
    previousUniqueNumbersArray.push(newUniqueNumber);
    return newUniqueNumber;
  };
}

/**
 * @param {Array} element - Массив, случайный элемент которого необходимо получить
 * @returns {any}
 */
function getRandomElementFromArray (element) {
  return element[getRandomInteger(0, element.length - 1)];
}

/**
 * Закрывает переданный элемент оверлея
 * @param {Element} overlayElement - элемент оверлея, который нужно закрыть
 */
function closeOverlay(overlayElement) {
  if (overlayElement) {
    overlayElement.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
}


/**
 * Обрабатывает событие нажатия клавиш на клавиатуре.
 * @param {Event} event - Событие keydown.
 * @param {Element} overlayElement - элемент оверлея, который нужно закрыть
 */
function handleDocumentKeydown(event, overlayElement) {
  const hashtagsInput = document.querySelector('.text__hashtags');
  const descriptionTextarea = document.querySelector('.text__description');
  if (isEscapeKey(event) && overlayElement && document.activeElement !== hashtagsInput && document.activeElement !== descriptionTextarea) {
    closeOverlay(overlayElement);
  }
}

/**
 * Проверяет была ли нажата кнопка Escape
 * @param {Event} evt - событие keydown
 * @returns {boolean} - возвращает true, если была нажата кнопка Escape
 */
function isEscapeKey(evt) {
  return evt.key === 'Escape';
}

export {getRandomInteger, getRandomUniqueNumberFromRange, getRandomElementFromArray, handleDocumentKeydown, closeOverlay};
