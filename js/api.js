const SERVER_URL = 'https://32.javascript.htmlacademy.pro/kekstagram';

/**
 * Создает маршрут на основе действия и метода
 * @param {string} action Название действия
 * @param {string} method HTTP-метод запроса (GET или POST)
 * @returns {string} Полный URL маршрута с указанным методом
 */
const getRoute = (action, method) => {
  const routeMap = {
    GetPhotosData: '/data',
    SendUserData: '/',
  };
  return { url: `${SERVER_URL}${routeMap[action]}`, method };
};

/**
 * Обращается к серверу по указанному действию и методу
 * @param {string} action Действие относительно сервера
 * @param {string} method HTTP-метод запроса (GET или POST)
 * @param {FormData} [body] Тело запроса в виде FormData (только для POST)
 * @returns {Promise<any>} Возвращает промис с ответом сервера или выбрасывает ошибку
 */
const fetchToServer = async (action, method, body = null) => {
  const { url, method: requestMethod } = getRoute(action, method);
  const response = await fetch(url, { method: requestMethod, body });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
  }

  return response.json();
};

// Примеры использования
const getData = () => fetchToServer('GetPhotosData', 'GET');
const sendData = (body) => fetchToServer('SendUserData', 'POST', body);

export { getData, sendData };
