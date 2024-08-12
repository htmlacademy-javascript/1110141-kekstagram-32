import { getData } from './api.js';
import { drawMiniatures } from './miniatures-draw.js';
import { initUploadPhotoInput } from './photo-upload.js';
import { initDocumentKeydown, showDataError, debounce, setActiveFilterButton, getFilteredPhotos, handleImageFiltersClick } from './util.js';

const TIMEOUT = 5000;
const imgFilters = document.querySelector('.img-filters');

initDocumentKeydown();
initUploadPhotoInput();

// Получаем данные о фото с сервера
getData()
  .then((userPhotos) => {
    // Если успех — отрисовываем изображения
    drawMiniatures(userPhotos);
    imgFilters.classList.remove('img-filters--inactive');

    // Обработчик с устранением дребезга
    const debouncedGetFilteredPhotos = debounce((filterType) => {
      const filteredPhotos = getFilteredPhotos(userPhotos, filterType);
      drawMiniatures(filteredPhotos);
      setActiveFilterButton(filterType);
    });

    imgFilters.addEventListener('click', (event) => handleImageFiltersClick(event, debouncedGetFilteredPhotos));

  }).catch(() => {
    // Если ошибка — показываем соответствующий блок
    showDataError(TIMEOUT);
  });
