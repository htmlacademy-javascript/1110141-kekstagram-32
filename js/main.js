import { generatePhotos } from './data.js';
import { drawMiniatures } from './miniatures-draw.js';

const generatedPhotos = generatePhotos(25);

drawMiniatures(generatedPhotos);
