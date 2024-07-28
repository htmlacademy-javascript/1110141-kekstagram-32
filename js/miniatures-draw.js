import { bindFullscreenImage } from './fullscreen-image.js';

const pictureTemplate = document.querySelector('template#picture'); // Шаблон миниатюры
const templateContent = pictureTemplate.content;
const pictureElement = templateContent.querySelector('a.picture');
const fragment = document.createDocumentFragment(); // Фрагмент для записи миниатюр
const picturesList = document.querySelector('.pictures');


/**
 * Создаёт миниатюры из аргумента фотографий
 * @param {array} photos - массив объектов фотографий
 */
function drawMiniatures (photos) {
  photos.forEach((photoObject) => {
    const newPictureElement = pictureElement.cloneNode(true);
    const pictureImg = newPictureElement.querySelector('img.picture__img');
    const pictureLikes = newPictureElement.querySelector('span.picture__likes');
    const pictureComments = newPictureElement.querySelector('.picture__comments');

    pictureImg.src = photoObject.url;
    pictureImg.alt = photoObject.description;

    pictureLikes.textContent = photoObject.likes;

    pictureComments.textContent = photoObject.comments.length;

    // Можно было бы использовать main.js в качестве точки входа, возвращать из drawMiniatures список миниатюр и через делегирование с передачей сгенерированного массива объектов изображений добавлять слушатель, но непонятно как связать кликнутую миниатюру и объект массива (если только не добавлять в вёрстку data-id атрибут, но я хз можно ли так. UPD: Антон сказал что можно, но можно как-то решить этот вопрос через замыкания, пока хз как)
    newPictureElement.addEventListener('click', (evt) => bindFullscreenImage(evt, photoObject));

    fragment.appendChild(newPictureElement);
  });

  picturesList.appendChild(fragment);
}

export {drawMiniatures};
