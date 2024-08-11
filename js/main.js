import { getData } from './api.js';
import { drawMiniatures } from './miniatures-draw.js';
import { initUploadPhotoInput } from './photo-upload.js';
import { initDocumentKeydown, showDataError, debounce } from './util.js';

const TIMEOUT = 5000;
const imgFilters = document.querySelector('.img-filters');

initDocumentKeydown();
initUploadPhotoInput();

// Функция для случайного перемешивания массива
function shuffleArray(array) {
  return array.slice().sort(() => Math.random() - 0.5);
}

// Функция для обновления фотографий
function updatePhotos(userPhotos, filterType) {
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
  drawMiniatures(sortedPhotos);
}

function setActiveFilterButton (id) {
  document.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
  document.querySelector(`#${id}`).classList.add('img-filters__button--active');
}

// Получаем данные о фото с сервера
getData()
  .then((userPhotos) => {
    // Если успех — отрисовываем изображения
    drawMiniatures(userPhotos);
    imgFilters.classList.remove('img-filters--inactive');

    // Обработчик с устранением дребезга
    const debouncedUpdatePhotos = debounce((filterType) => {
      updatePhotos(userPhotos, filterType);
      setActiveFilterButton(filterType);
    });

    imgFilters.addEventListener('click', (event) => {
      const id = event.target.id;
      if (id === 'filter-default' || id === 'filter-random' || id === 'filter-discussed') {
        debouncedUpdatePhotos(id);
      }
    });

  }).catch(() => {
    // Если ошибка — показываем соответствующий блок
    showDataError(TIMEOUT);
  });
