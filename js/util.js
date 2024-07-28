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


export {getRandomInteger, getRandomUniqueNumberFromRange, getRandomElementFromArray};
