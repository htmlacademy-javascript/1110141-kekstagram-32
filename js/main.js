import {generatePhotos} from './data.js';
import { drawMiniatures } from './miniatures-draw.js';

const randomObjectsArray = generatePhotos(25);

drawMiniatures(randomObjectsArray);
