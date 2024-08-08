import { getData } from './api.js';
import { drawMiniatures } from './miniatures-draw.js';
import { handleUploadPhoto } from './photo-upload.js';
import { handleDocumentKeydown } from './util.js';

document.addEventListener('keydown', (evt) => handleDocumentKeydown(evt));
const uploadPhotoInput = document.querySelector('.img-upload__input');
uploadPhotoInput.addEventListener('change', handleUploadPhoto);

// Получаем данные о фото с сервера
getData('GET_PHOTOS_DATA')
  .then((userPhotos) => {
    // Если успех — отрисовываем изображения
    drawMiniatures(userPhotos);
  }).catch(() => {
    // Если ошибка — показываем соответствующий блок
    document.body.append(document.querySelector('#data-error').content.cloneNode(true));
    setTimeout(() => {
      document.querySelector('.data-error').remove();
    }, 5000);
  });
