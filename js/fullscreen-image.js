import { closeModal } from './util.js';

const COMMENTS_RENDER_NUMBER = 5;

const bigPictureElement = document.querySelector('.big-picture');
const cancelPictureButton = bigPictureElement.querySelector('#picture-cancel');
const bigPictureImage = bigPictureElement.querySelector('.big-picture__img img');
const likesCountElement = bigPictureElement.querySelector('.likes-count');
const shownCommentsCountElement = bigPictureElement.querySelector('.social__comment-shown-count');
const totalCommentsCountElement = bigPictureElement.querySelector('.social__comment-total-count');
const commentsListElement = bigPictureElement.querySelector('.social__comments');
const descriptionElement = bigPictureElement.querySelector('.social__caption');
const commentsLoaderButton = bigPictureElement.querySelector('.comments-loader');
const commentTemplateElement = document.querySelector('.social__comment');

cancelPictureButton.addEventListener('click', () => closeModal(bigPictureElement));

let currentCommentsFragmentFunction = null;

/**
 * Открывает окно с большой фотографией.
 * @param {Function} newCommentsFragmentFunction - Функция для рендеринга фрагмента комментариев.
 */
function openBigPicture(newCommentsFragmentFunction) {
  if (currentCommentsFragmentFunction) {
    commentsLoaderButton.removeEventListener('click', currentCommentsFragmentFunction);
  }

  currentCommentsFragmentFunction = newCommentsFragmentFunction;
  commentsLoaderButton.addEventListener('click', currentCommentsFragmentFunction);

  bigPictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
}

/**
 * Рендерит комментарии по шагам.
 * @param {Array} commentsArray - Массив комментариев.
 * @param {number} [step=COMMENTS_RENDER_NUMBER] - Количество комментариев для рендеринга за шаг.
 * @returns {Function} - Функция, которая рендерит следующую порцию комментариев.
 */
function renderComments(commentsArray, step = COMMENTS_RENDER_NUMBER) {
  let renderedCommentsCount = 0;

  return function () {
    const fragment = document.createDocumentFragment();

    const remainingCommentsCount = commentsArray.length - renderedCommentsCount;
    const commentsToShowCount = Math.min(step, remainingCommentsCount);

    for (let i = 0; i < commentsToShowCount; i++) {
      const comment = commentsArray[renderedCommentsCount++];
      const newComment = commentTemplateElement.cloneNode(true);
      const socialPictureElement = newComment.querySelector('.social__picture');
      newComment.querySelector('.social__text').textContent = comment.message;

      socialPictureElement.src = comment.avatar;
      socialPictureElement.alt = comment.name;

      fragment.appendChild(newComment);
    }

    commentsListElement.appendChild(fragment);
    shownCommentsCountElement.textContent = renderedCommentsCount;

    if (renderedCommentsCount >= commentsArray.length) {
      commentsLoaderButton.classList.add('hidden');
    } else {
      commentsLoaderButton.classList.remove('hidden');
    }
  };
}

/**
 * Привязывает функциональность полноэкранного изображения.
 * @param {Event} event - Объект события.
 * @param {Object} photoData - Данные фотографии.
 */
function handleOpenFullscreenImage(event, photoData) {
  event.preventDefault();

  const commentsFragmentFunction = renderComments(photoData.comments, COMMENTS_RENDER_NUMBER);

  bigPictureImage.src = photoData.url;
  likesCountElement.textContent = photoData.likes;

  shownCommentsCountElement.textContent = 0;
  totalCommentsCountElement.textContent = photoData.comments.length;

  commentsListElement.innerHTML = '';
  commentsFragmentFunction();

  descriptionElement.textContent = photoData.description;
  openBigPicture(commentsFragmentFunction);
}

export { handleOpenFullscreenImage };
