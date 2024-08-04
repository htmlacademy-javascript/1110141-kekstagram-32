import { handleDocumentKeydown, closeOverlay } from './util.js';

const HASHTAGS_MAX_COUNT = 5;
const DESCRIPTION_MAX_LENGTH = 140;

const uploadPhotoOverlay = document.querySelector('.img-upload__overlay');
const uploadCancel = uploadPhotoOverlay.querySelector('#upload-cancel');
const uploadImageForm = document.querySelector('.img-upload__form');

document.addEventListener('keydown', (evt) => handleDocumentKeydown(evt, uploadPhotoOverlay));
uploadCancel.addEventListener('click', () => closeOverlay(uploadPhotoOverlay));

// Пока что временно экспортируем эту функцию, потом модуль будет экспортировать изображение для вставки в сетку
function handleUploadPhoto() {
  uploadPhotoOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
}

const pristine = new Pristine(uploadImageForm, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--invalid',
  successClass: 'img-upload__field-wrapper--valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__field-wrapper--error',
});

/**
 * Проверяет хештеги в input.text__hashtags на соответствие критериям:
 * - хэштег начинается с символа # (решётка);
 * - строка после решётки должна состоять из букв и чисел и не может содержать пробелы, спецсимволы (#, @, $ и т. п.), символы пунктуации (тире, дефис, запятая и т. п.), эмодзи и т. д.;
 * - хеш-тег не может состоять только из одной решётки;
 * - максимальная длина одного хэштега 20 символов, включая решётку;
 * - хэштеги нечувствительны к регистру: #ХэшТег и #хэштег считаются одним и тем же тегом;
 * - хэштеги необязательны.
 * @param {*} value - Значение проверяемого input
 * @returns {boolean} - true, если число хештегов равно или менее HASHTAGS_MAX_COUNT
 */
function validateHashtags(value) {
  value = value.trim();

  if (value === '') {
    return true;
  }

  const hashtags = value.split(' ');

  const RegExp = /^#[a-zа-яё0-9]{1,19}$/i;

  // Проверка на валидность каждого хештега
  const allValid = hashtags.every((el) => RegExp.test(el));

  if (!allValid) {
    return false;
  }

  return true;
}

pristine.addValidator(uploadImageForm.querySelector('.text__hashtags'), validateHashtags, 'Введён невалидный хэштег', 1);

/**
 * Проверяет количество хештегов в input.text__hashtags
 * @param {string} value - Значение проверяемого input
 * @returns {boolean} - true, если число хештегов равно или менее HASHTAGS_MAX_COUNT
 */
function checkHashtagsCount (value) {
  value = value.trim();

  const hashtags = value.split(' ');

  return hashtags.length <= HASHTAGS_MAX_COUNT;
}

pristine.addValidator(uploadImageForm.querySelector('.text__hashtags'), checkHashtagsCount, 'Превышено количество хэштегов', 2);

/**
 * Проверяет уникальность хештегов в input.text__hashtags
 * @param {string} value - Значение проверяемого input
 * @returns {boolean} - true, если все хештеги уникальны
 */
function checkHashtagsUnique (value) {
  value = value.trim();
  const hashtags = value.split(' ');
  const uniqueHashtags = new Set(hashtags.map((tag) => tag.toLowerCase()));

  return uniqueHashtags.size === hashtags.length;
}

pristine.addValidator(uploadImageForm.querySelector('.text__hashtags'), checkHashtagsUnique, 'Хэштеги повторяются', 3);

/**
 * Проверяет длину значения textarea.text__description
 * @param {string} value — Значение проверяемого textarea
 * @returns {boolean} - true, если длина значения меньше или равна DESCRIPTION_MAX_LENGTH
 */
function checkDescriptionLength (value) {
  value = value.trim();
  return value.length <= DESCRIPTION_MAX_LENGTH;
}

pristine.addValidator(uploadImageForm.querySelector('.text__description'), checkDescriptionLength, 'Длина комментария больше 140 символов');

uploadImageForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  if (!pristine.validate()) {
    throw new Error('Валидация не прошла');
  }
});

export { handleUploadPhoto };
