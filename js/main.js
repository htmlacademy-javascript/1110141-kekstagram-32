import {COMMENT_MESSAGES, NAMES} from '/data.js';
import {getRandomInteger, getRandomUniqueNumberFromRange, getRandomElementFromArray} from '/util.js';

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

function generatePhotos (length) {
  return Array.from({length: length}, getGeneratedPhoto);
}

const randomObjectsArray = generatePhotos(25);
