
const COMMENT_MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

const NAMES = [
  'Иван',
  'Хуан Себастьян',
  'Мария',
  'Кристоф',
  'Виктор',
  'Юлия',
  'Люпита',
  'Вашингтон',
];

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

const photoID = getRandomUniqueNumberFromRange();
const imageNameNumber = getRandomUniqueNumberFromRange();
const commentID = getRandomUniqueNumberFromRange(1, 1000);

function getGeneratedPhoto () {

  const randomAvatarNumber = getRandomInteger(1, 6);

  return {
    id:   photoID(), // От 1 до 25, не должны повторяться
    url: `photos/${imageNameNumber()}.jpg`, // Адрес картинки вида photos/{{i}}.jpg, где {{i}} — это число от 1 до 25. Адреса картинок не должны повторяться.
    description: 'description', // Любая строка
    likes: getRandomInteger(15, 200), // Случайное число от 15 до 200
    comments: [
      {
        id: commentID(), // Любое число, не должны повторяться
        avatar: `img/avatar-${randomAvatarNumber}.svg`, // Строка, значение которой формируется по правилу img/avatar-{{случайное число от 1 до 6}}.svg. Аватарки подготовлены в директории img
        message: getRandomElementFromArray(COMMENT_MESSAGES), // Для формирования текста комментария необходимо взять одно или два случайных предложения из массива commentMessagesArray
        name: getRandomElementFromArray(NAMES), // Должны быть случайными. Набор имён для комментаторов составьте сами
      }
    ],
  };
}

function generatePhotos () {
  return Array.from({length: 25}, getGeneratedPhoto);
}

const randomObjectsArray = generatePhotos();

console.table(randomObjectsArray);
