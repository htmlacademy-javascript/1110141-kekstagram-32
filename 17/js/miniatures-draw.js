import { handleOpenFullscreenImage } from './fullscreen-image.js';

const pictureTemplate = document.querySelector('#picture'); // Шаблон миниатюры
const templateContent = pictureTemplate.content;
const pictureElement = templateContent.querySelector('.picture');
const fragment = document.createDocumentFragment(); // Фрагмент для записи миниатюр
const picturesList = document.querySelector('.pictures');


/**
 * Создаёт миниатюры из аргумента фотографий
 * @param {array} photos - массив объектов фотографий
 */
function drawMiniatures (photos) {
  photos.forEach((photoObject) => {
    const newPictureElement = pictureElement.cloneNode(true);
    const pictureImg = newPictureElement.querySelector('.picture__img');
    newPictureElement.querySelector('.picture__likes').textContent = photoObject.likes;
    newPictureElement.querySelector('.picture__comments').textContent = photoObject.comments.length;

    pictureImg.src = photoObject.url;
    pictureImg.alt = photoObject.description;

    newPictureElement.addEventListener('click', (evt) => handleOpenFullscreenImage(evt, photoObject));

    fragment.appendChild(newPictureElement);
  });

  picturesList.appendChild(fragment);
}

export {drawMiniatures};
