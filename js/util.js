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
 * Закрывает переданный элемент
 * @param {Element} modalElement - элемент, который нужно закрыть
 */
function closeModal(modalElement) {
  if (modalElement) {
    modalElement.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
}

/**
 * Обрабатывает событие нажатия клавиш на клавиатуре.
 * @param {Event} event - Событие keydown.
 */
function handleDocumentKeydown(event) {
  const hashtagsInput = document.querySelector('.text__hashtags');
  const descriptionTextarea = document.querySelector('.text__description');
  if (isEscapeKey(event)) {
    if (document.querySelector('.error')) {
      document.querySelector('.error').remove();
    } else if(document.querySelector('.success')) {
      document.querySelector('.success').remove();
    } else if (!document.querySelector('.img-upload__overlay').classList.contains('hidden') && (document.activeElement !== hashtagsInput && document.activeElement !== descriptionTextarea)) {
      closeModal(document.querySelector('.img-upload__overlay'));
    }

    if (!document.querySelector('.big-picture').classList.contains('hidden')) {
      closeModal(document.querySelector('.big-picture'));
    }
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

/**
 * Инициализация слушателя поля загрузки изображений
 */
function initDocumentKeydown() {
  document.addEventListener('keydown', (evt) => handleDocumentKeydown(evt));
}

/**
 * Показывает ошибку о безуспешной попытке получить данные с сервера и удаляет эту ошибку из DOM через указанное время
 * @param {Number} timeout Таймаут исчезновения ошибки, мс
 */
function showDataError(timeout) {
  document.body.append(document.querySelector('#data-error').content.cloneNode(true));
  setTimeout(() => {
    document.querySelector('.data-error').remove();
  }, timeout);
}

function debounce (callback, timeoutDelay = 500) {
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
}

/**
 * Убирает "активный" класс с текущей кнопки и присваивает новой кнопке
 * @param {String} id ID кликнутной кнопки 
 */
function setActiveFilterButton (id) {
  document.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
  document.querySelector(`#${id}`).classList.add('img-filters__button--active');
}

/**
 * Перемешивает элементы переданного массива случайным образом
 * @param {Array} array Массив для перемешивания 
 * @returns {Array} Перемешанный случайным образом массив
 */
function shuffleArray(array) {
  return array.slice().sort(() => Math.random() - 0.5);
}

/**
 * Перерисовывает пользовательские фотографии на основании полученых массива фотографий и ID кликнутой кнопки 
 * @param {Array} userPhotos Массив объектов пользовательских изображений
 * @param {String} filterType ID кликнутой кнопки относительно которого будет производиться отрисовка фотографий
 */
function getFilteredPhotos(userPhotos, filterType) {
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
}

function handleImageFiltersClick (event, debouncedGetFilteredPhotos) {
  const id = event.target.id;
  if (id === 'filter-default' || id === 'filter-random' || id === 'filter-discussed') {
    debouncedGetFilteredPhotos(id);
  }
}

export {getRandomInteger, getRandomUniqueNumberFromRange, getRandomElementFromArray, initDocumentKeydown, closeModal, showDataError, debounce, setActiveFilterButton, getFilteredPhotos, handleImageFiltersClick};
