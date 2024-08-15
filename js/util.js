import { onCancelClick } from './photo-upload.js';

/**
 * Получает случайное число из диапазона
 * @param {number} min - Минимальное значение диапазона случайных чисел
 * @param {number} max - Максимальное значение диапазона случайных чисел
 * @returns {int} result - Случайное число из диапазона
 */
const getRandomInteger = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

/**
 * Получает случайное уникальное число из указанного диапазона
 * @param {number} min - Минимальное значение диапазона случайных чисел
 * @param {number} max - Максимальное значение диапазона случайных чисел
 * @returns {int} newUniqueNumber - Случайное уникальное число из диапазона
 */

const getRandomUniqueNumberFromRange = (min = 1, max = 25) => {
  const previousUniqueNumbers = [];

  return () => {
    let newUniqueNumber = getRandomInteger(min, max);
    if (previousUniqueNumbers.length >= (max - min + 1)) {
      return null;
    }
    while (previousUniqueNumbers.includes(newUniqueNumber)) {
      newUniqueNumber = getRandomInteger(min, max);
    }
    previousUniqueNumbers.push(newUniqueNumber);
    return newUniqueNumber;
  };
};

/**
 * @param {Array} elements - Массив, случайный элемент которого необходимо получить
 * @returns {any}
 */
const getRandomElementFromArray = (elements) => elements[getRandomInteger(0, elements.length - 1)];

/**
 * Закрывает переданный элемент
 * @param {Element} modalElement - элемент, который нужно закрыть
 */
const closeModal = (modalElement) => {
  if (modalElement) {
    modalElement.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
};

/**
 * Проверяет была ли нажата кнопка Escape
 * @param {Event} event - событие keydown
 * @returns {boolean} - возвращает true, если была нажата кнопка Escape
 */
const isEscapeKey = (event) => event.key === 'Escape';

/**
 * Обрабатывает событие нажатия клавиш на клавиатуре.
 * @param {Event} event - Событие keydown.
 */
const onDocumentKeydown = (event) => {
  const hashtagsInput = document.querySelector('.text__hashtags');
  const descriptionTextarea = document.querySelector('.text__description');
  if (isEscapeKey(event)) {
    if (document.querySelector('.error')) {
      document.querySelector('.error').remove();
    } else if(document.querySelector('.success')) {
      document.querySelector('.success').remove();
    } else if (!document.querySelector('.img-upload__overlay').classList.contains('hidden') && (document.activeElement !== hashtagsInput && document.activeElement !== descriptionTextarea)) {
      onCancelClick();
    }

    if (!document.querySelector('.big-picture').classList.contains('hidden')) {
      closeModal(document.querySelector('.big-picture'));
    }
  }
};

/**
 * Инициализация слушателя поля загрузки изображений
 */
const initDocumentKeydown = () => {
  document.addEventListener('keydown', (event) => onDocumentKeydown(event));
};

/**
 * Показывает ошибку о безуспешной попытке получить данные с сервера и удаляет эту ошибку из DOM через указанное время
 * @param {Number} timeout Таймаут исчезновения ошибки, мс
 */
const showDataError = (timeout) => {
  document.body.append(document.querySelector('#data-error').content.cloneNode(true));
  setTimeout(() => {
    document.querySelector('.data-error').remove();
  }, timeout);
};

/**
 * Убирает "активный" класс с текущей кнопки и присваивает новой кнопке
 * @param {String} id ID кликнутной кнопки
 */
const setActiveFilterButton = (id) => {
  document.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
  document.querySelector(`#${id}`).classList.add('img-filters__button--active');
};

/**
 * Перемешивает элементы переданного массива случайным образом
 * @param {Array} elements Массив для перемешивания
 * @returns {Array} Перемешанный случайным образом массив
 */
const shuffleArray = (elements) => elements.slice().sort(() => Math.random() - 0.5);

/**
 * Перерисовывает пользовательские фотографии на основании полученых массива фотографий и ID кликнутой кнопки
 * @param {Array} userPhotos Массив объектов пользовательских изображений
 * @param {String} filterType ID кликнутой кнопки относительно которого будет производиться отрисовка фотографий
 */
const getFilteredPhotos = (userPhotos, filterType) => {
  let sortedPhotos;
  switch (filterType) {
    case 'filter-default':
      // Фотографии в изначальном порядке
      sortedPhotos = userPhotos;
      break;
    case 'filter-random':
      // 10 случайных, не повторяющихся фотографий
      sortedPhotos = shuffleArray(userPhotos).slice(0, 10);
      break;
    case 'filter-discussed':
      // Фотографии, отсортированные в порядке убывания количества комментариев
      sortedPhotos = userPhotos.slice().sort((a, b) => b.comments.length - a.comments.length);
      break;
    default:
      sortedPhotos = userPhotos;
  }
  return sortedPhotos;
};

const debounce = (callback, timeoutDelay = 500) => {
  // Используем замыкания, чтобы id таймаута у нас навсегда приклеился
  // к возвращаемой функции с setTimeout, тогда мы его сможем перезаписывать
  let timeoutId;

  return (...rest) => {
    // Перед каждым новым вызовом удаляем предыдущий таймаут,
    // чтобы они не накапливались
    clearTimeout(timeoutId);

    // Затем устанавливаем новый таймаут с вызовом колбэка на ту же задержку
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);

    // Таким образом цикл «поставить таймаут - удалить таймаут» будет выполняться,
    // пока действие совершается чаще, чем переданная задержка timeoutDelay
  };
};

const onImageFiltersClick = (event, debouncedGetFilteredPhotos) => {
  const id = event.target.id;
  if (id === 'filter-default' || id === 'filter-random' || id === 'filter-discussed') {
    debouncedGetFilteredPhotos(id);
  }
  setActiveFilterButton(id);
};

export { getRandomInteger, getRandomUniqueNumberFromRange, getRandomElementFromArray, initDocumentKeydown, closeModal, showDataError, debounce, setActiveFilterButton, getFilteredPhotos, onImageFiltersClick };
