import { generatePhotos } from './data.js';
import { drawMiniatures } from './miniatures-draw.js';
import { handleUploadPhoto } from './photo-upload.js';

const uploadPhotoInput = document.querySelector('.img-upload__input');
uploadPhotoInput.addEventListener('change', handleUploadPhoto);

const generatedPhotos = generatePhotos(25);

drawMiniatures(generatedPhotos);
