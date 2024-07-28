import { isEscapeKey } from './util.js';

const bigPicture = document.querySelector('.big-picture');
const pictureCancel = bigPicture.querySelector('#picture-cancel');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentShownCount = bigPicture.querySelector('.social__comment-shown-count');
const comentsTotalCount = bigPicture.querySelector('.social__comment-total-count');
const commentsList = bigPicture.querySelector('.social__comments');
const description = bigPicture.querySelector('.social__caption');
const commentsLoader = bigPicture.querySelector('.comments-loader');

/**
 * Обрабатывает нажатие клавиш на клавиатуре
 * @param {Event} evt — событие keydown
 */
function onDocumentKeydown(evt) {
  if (isEscapeKey(evt)) {
    closeBigPicture();
  }
}

function openBigPicture(getCommentsFragment) {
  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');

  pictureCancel.addEventListener('click', closeBigPicture);
  document.addEventListener('keydown', onDocumentKeydown);

  // Добавляем обработчик для commentsLoader
  commentsLoader.addEventListener('click', getCommentsFragment);
}

function closeBigPicture(getCommentsFragment) {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');

  pictureCancel.removeEventListener('click', closeBigPicture);
  document.removeEventListener('keydown', onDocumentKeydown);

  // Удаляем обработчик для commentsLoader
  commentsLoader.removeEventListener('click', getCommentsFragment);
}

function renderComments(comments, step = 5) {
  let commentsRendered = 0;

  return function () {
    const fragment = document.createDocumentFragment();
    const commentsTemplate = document.createElement('template');
    commentsTemplate.innerHTML = `
      <li class="social__comment">
        <img class="social__picture" src="" alt="" width="35" height="35">
        <p class="social__text"></p>
      </li>
    `;

    const remainingComments = comments.length - commentsRendered;
    const commentsToShow = Math.min(step, remainingComments);

    for (let i = 0; i < commentsToShow; i++) {
      const comment = comments[commentsRendered++];
      const newComment = commentsTemplate.content.cloneNode(true);
      const socialPicture = newComment.querySelector('.social__picture');
      const socialText = newComment.querySelector('.social__text');

      socialPicture.src = comment.avatar;
      socialPicture.alt = comment.name;
      socialText.textContent = comment.message;

      fragment.appendChild(newComment);
    }

    commentsList.appendChild(fragment);
    commentShownCount.textContent = commentsRendered;

    // Скрыть кнопку загрузки, если все комментарии отображены
    if (commentsRendered >= comments.length) {
      commentsLoader.classList.add('hidden');
    } else {
      commentsLoader.classList.remove('hidden');
    }
  };
}

function bindFullscreenImage(evt, photoObject) {
  evt.preventDefault();

  const getCommentsFragment = renderComments(photoObject.comments, 5);

  bigPictureImg.src = photoObject.url;
  likesCount.textContent = photoObject.likes;

  commentShownCount.textContent = 0; // Сначала показано 0 комментариев
  comentsTotalCount.textContent = photoObject.comments.length;

  commentsList.innerHTML = ''; // Очищаем список комментариев
  getCommentsFragment(); // Отображаем первые комментарии

  description.textContent = photoObject.description;

  openBigPicture(getCommentsFragment);

  // При закрытии окна также удаляем обработчик для commentsLoader
  // TODO: Короче я запутался к хуям, надо спросить как упростить всю эту балалайку, потому что по-моему оно так быть не должно, но работает
  pictureCancel.addEventListener('click', () => closeBigPicture(getCommentsFragment));
}

export { bindFullscreenImage };
