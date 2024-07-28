import {isEscapeKey} from './util.js';

const bigPicture = document.querySelector('.big-picture');
const pictureCancel = bigPicture.querySelector('#picture-cancel');

function onDocumentKeydown (evt) {
  if (isEscapeKey(evt)) {
    closeBigPicture();
  }
}

function openBigPicture () {
  bigPicture.classList.remove('hidden');

  document.body.classList.add('modal-open');

  pictureCancel.addEventListener('click', closeBigPicture);
  document.addEventListener('keydown', (evt) => onDocumentKeydown(evt));
}

function closeBigPicture () {
  bigPicture.classList.add('hidden');

  document.body.classList.remove('modal-open');

  pictureCancel.removeEventListener('click', closeBigPicture);
  document.removeEventListener('keydown', onDocumentKeydown);
}

/**
 * Отрисовывает коментарии для большого изображения и возвращает fragment с ними
 * @param {Array} comments — массив объектов комментариев (структура описана в data.js)
 * @param {*} counter — счётчик комментарев (вычисляется в функции bindFullscreenImage)
 * @returns {fragment} — фрагмент с комментариями
 */
function renderComments (comments, counter) {
  const commentsTemplate = document.createElement('template');
  commentsTemplate.innerHTML = '<li class="social__comment"><img class="social__picture" src="" alt="" width="35" height="35"><p class="social__text"></p></li>';

  const fragment = document.createDocumentFragment();

  const templateContent = commentsTemplate.content;

  for (let i = 0; i <= counter - 1; i++) {
    const comment = comments[i];

    const newComment = templateContent.cloneNode(true);

    const socialPicture = newComment.querySelector('.social__picture');
    const socialText = newComment.querySelector('.social__text');

    socialPicture.src = comment.avatar;
    socialPicture.alt = comment.name;

    socialText.textContent = comment.message;

    fragment.append(newComment);
  }

  return fragment;
}


function bindFullscreenImage (photoObject) {
  // Должны ли эти константы быть написаны в начале файла и заглавными буквами?
  const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
  const likesCount = bigPicture.querySelector('.likes-count');
  const commentShownCount = bigPicture.querySelector('.social__comment-shown-count');
  const comentsTotalCount = bigPicture.querySelector('.social__comment-total-count');
  const shownCommentsCounter = photoObject.comments.length < 4 ? photoObject.comments.length : 4; // Количество выводимых изначально комментариев
  const commentsList = bigPicture.querySelector('.social__comments');
  const commentsFragment = renderComments(photoObject.comments, shownCommentsCounter);
  const description = bigPicture.querySelector('.social__caption');
  const commentCount = bigPicture.querySelector('.social__comment-count');
  const commentsLoader = bigPicture.querySelector('.comments-loader');

  bigPictureImg.src = photoObject.url;
  likesCount.textContent = photoObject.likes;

  commentShownCount.textContent = shownCommentsCounter;
  comentsTotalCount.textContent = photoObject.comments.length;

  commentsList.innerHTML = '';
  commentsList.append(commentsFragment);

  description.textContent = photoObject.description;

  openBigPicture();

  commentCount.classList.add('hidden');
  commentsLoader.classList.add('hidden');
}

export {bindFullscreenImage};
