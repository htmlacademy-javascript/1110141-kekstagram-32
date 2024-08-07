import { handleDocumentKeydown, closeOverlay } from './util.js';

const HASHTAGS_MAX_COUNT = 5;
const DESCRIPTION_MAX_LENGTH = 140;
const EFFECTS = {
  none: { filter: 'none', min: 0, max: 100, step: 1, unit: '' },
  chrome: { filter: 'grayscale', min: 0, max: 1, step: 0.1, unit: '' },
  sepia: { filter: 'sepia', min: 0, max: 1, step: 0.1, unit: '' },
  marvin: { filter: 'invert', min: 0, max: 100, step: 1, unit: '%' },
  phobos: { filter: 'blur', min: 0, max: 3, step: 0.1, unit: 'px' },
  heat: { filter: 'brightness', min: 1, max: 3, step: 0.1, unit: '' },
};

const uploadPhotoOverlay = document.querySelector('.img-upload__overlay');
const uploadCancel = uploadPhotoOverlay.querySelector('#upload-cancel');
const uploadImageForm = document.querySelector('.img-upload__form');

const smallerScaleButton = uploadImageForm.querySelector('.scale__control--smaller');
const biggerScaleButton = uploadImageForm.querySelector('.scale__control--bigger');
const scaleValueElement = uploadImageForm.querySelector('.scale__control--value');
const previewImage = uploadPhotoOverlay.querySelector('.img-upload__preview img');

const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectLevelContainer = document.querySelector('.img-upload__effect-level');
const effectsInputs = uploadPhotoOverlay.querySelectorAll('.effects__list input');

// Инициализация слайдера
noUiSlider.create(effectLevelSlider, {
  range: {
    min: 0,
    max: 100
  },
  start: 100,
  step: 1,
  connect: 'lower',
});

// При изменении слайдера изменяем насыщенность фильтров
effectLevelSlider.noUiSlider.on('change', () => {
  const currentEffect = EFFECTS[uploadImageForm.querySelector('.effects__radio:checked').value];
  const currentValue = effectLevelSlider.noUiSlider.get();
  previewImage.style.filter = `${currentEffect.filter}(${currentValue}${currentEffect.unit})`;
  effectLevelValue.value = parseFloat(currentValue);
});

// При клике по кнопкам фильтров уровень насыщенности сбрасывается до начального значения (100%): слайдер, фильтр изображения и значение поля обновляются, а если указан "Оригинал" — фильтр сбрасывается, а слайдер скрывается
// TODO: Узнать, какое значение должно записываться в поле, если указан фильтр "Оригинал"
uploadPhotoOverlay.querySelector('.effects__list').addEventListener('click', (event) => {
  const target = event.target;
  if (target.classList.contains('effects__radio')) {
    const targetValue = target.value;
    if (targetValue !== 'none') {
      effectLevelContainer.style.display = 'block';
      effectLevelSlider.noUiSlider.updateOptions({
        range: {
          min: EFFECTS[targetValue].min,
          max: EFFECTS[targetValue].max,
        },
        start: EFFECTS[targetValue].max,
        step: EFFECTS[targetValue].step,
      });
      previewImage.style.filter = `${EFFECTS[targetValue].filter}(${EFFECTS[targetValue].max}${EFFECTS[targetValue].unit})`;
      effectLevelValue.value = parseFloat(EFFECTS[targetValue].max);
    } else {
      previewImage.style.filter = 'none';
      effectLevelContainer.style.display = 'none';
    }
  }
});


// TODO: Клик по кнокам скейла можно переделать делегированием
/**
 * Увеличивает скейл изображения-превью
 */
function handleUpScale () {
  const scaleValue = parseInt(scaleValueElement.value, 10);
  if (scaleValue < 100) {
    const newScaleValue = scaleValue + 25;
    scaleValueElement.value = `${newScaleValue}%`;
    previewImage.style.transform = `scale(${newScaleValue / 100})`;
  }
}

/**
 * Уменьшает скейл изображения-превью
 */
function handleDownScale () {
  const scaleValue = parseInt(scaleValueElement.value, 10);
  if (scaleValue > 25) {
    const newScaleValue = scaleValue - 25;
    scaleValueElement.value = `${newScaleValue}%`;
    previewImage.style.transform = `scale(${newScaleValue / 100})`;
  }
}

biggerScaleButton.addEventListener('click', handleUpScale);
smallerScaleButton.addEventListener('click', handleDownScale);

document.addEventListener('keydown', (evt) => handleDocumentKeydown(evt, uploadPhotoOverlay));
uploadCancel.addEventListener('click', () => {
  closeOverlay(uploadPhotoOverlay);

  document.querySelector('.img-upload__preview img').style.transform = 'scale(1)';
  uploadPhotoOverlay.querySelector('.text__hashtags').value = '';
  uploadPhotoOverlay.querySelector('.text__description').value = '';

  // TODO: Узнать можно ли просто инициализировать клик по кнопке "Оригинал" или это костыль
  effectsInputs.forEach((input) => {
    input.checked = input.id === 'effect-none';
  });

  previewImage.style.filter = 'none';
  effectLevelContainer.style.display = 'none';

});

// Пока что временно экспортируем эту функцию, потом модуль будет экспортировать изображение для вставки в сетку (или нет 🤡)
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
