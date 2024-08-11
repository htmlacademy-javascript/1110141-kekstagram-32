import { getData } from './api.js';
import { drawMiniatures } from './miniatures-draw.js';
import { initUploadPhotoInput } from './photo-upload.js';
import { initDocumentKeydown, showDataError } from './util.js';

const TIMEOUT = 5000;

initDocumentKeydown();
initUploadPhotoInput();

// Получаем данные о фото с сервера
getData()
  .then((userPhotos) => {
    // Если успех — отрисовываем изображения
    drawMiniatures(userPhotos);
  }).catch(() => {
    // Если ошибка — показываем соответствующий блок
    showDataError(TIMEOUT);
  });
