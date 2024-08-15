import { getRandomInteger, getRandomUniqueNumberFromRange, getRandomElementFromArray } from './util.js';

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

const PHOTO_DESCRIPTIONS = [
  'Солнце тонет в воде.',
  'Котенок, покоряющий мир своим обаянием.',
  'Весна ожила в каждом цветке.',
  'Город в свете ночных огней.',
  'Величие снежных вершин.',
  'Море и первые лучи солнца.',
  'Листья шепчут о приходе осени.',
];

const MAX_COMMENT_ID = 1000;
const MAX_COMMENT_COUNT = 25;

const MAX_AVATAR_NUMBER = 6;

const MIN_LIKES_COUNT = 15;
const MAX_LIKES_COUNT = 200;

/**
 * Генерирует случайное количество комментариев
 * @returns {Function} - замыкание создания списка комментариев
 */
const generateComments = () => {

  const commentCount = getRandomInteger(1, MAX_COMMENT_COUNT); // Генерируем случайное количество комментариев
  const comments = Array(); // Массив-список комментариев

  for (let i = 0; i <= commentCount; i++) {
    const commentID = getRandomUniqueNumberFromRange(1, MAX_COMMENT_ID);

    const randomAvatarNumber = getRandomInteger(1, MAX_AVATAR_NUMBER);

    const comment = {
      id: commentID, // Любое число, не должны повторяться
      avatar: `img/avatar-${randomAvatarNumber}.svg`, // Строка, значение которой формируется по правилу img/avatar-{{случайное число от 1 до 6}}.svg. Аватарки подготовлены в директории img
      message: getRandomElementFromArray(COMMENT_MESSAGES), // Для формирования текста комментария необходимо взять одно или два случайных предложения из массива commentMessagesArray
      name: getRandomElementFromArray(NAMES), // Должны быть случайными. Набор имён для комментаторов составьте сами
    };

    comments.push(comment);
  }

  return comments;
};

const photoID = getRandomUniqueNumberFromRange();
const imageNameNumber = getRandomUniqueNumberFromRange();

const getGeneratedPhoto = () => {
  const description = getRandomElementFromArray(PHOTO_DESCRIPTIONS);
  const comments = generateComments();
  return {
    id:   photoID(), // От 1 до 25, не должны повторяться
    url: `photos/${imageNameNumber()}.jpg`, // Адрес картинки вида photos/{{i}}.jpg, где {{i}} — это число от 1 до 25. Адреса картинок не должны повторяться.
    description: description, // Любая строка
    likes: getRandomInteger(MIN_LIKES_COUNT, MAX_LIKES_COUNT), // Случайное число от 15 до 200
    comments: comments,
  };
};

const generatePhotos = (length) => Array.from({length: length}, getGeneratedPhoto);

export {generatePhotos};
