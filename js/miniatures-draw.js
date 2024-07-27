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
  photos.forEach((element) => {
    const newPictureElement = pictureElement.cloneNode(true);
    const pictureImg = newPictureElement.querySelector('img.picture__img');
    const pictureLikes = newPictureElement.querySelector('span.picture__likes');
    const pictureComments = newPictureElement.querySelector('.picture__comments');

    pictureImg.src = element.url;
    pictureImg.alt = element.description;

    pictureLikes.textContent = element.likes;

    pictureComments.textContent = element.comments.length;

    fragment.appendChild(newPictureElement);
  });

  picturesList.appendChild(fragment);
}

export {drawMiniatures};
