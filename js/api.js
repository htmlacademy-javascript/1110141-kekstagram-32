const SERVER_URL = 'https://32.javascript.htmlacademy.pro/kekstagram';
const ACTIONS = {
  GET_PHOTOS_DATA: {
    ROUTE: '/data',
    METHOD: 'GET',
  },
  SEND_USER_DATA: {
    ROUTE: '/',
    METHOD: 'POST',
  },
};

/**
 * Обращается к серверу по указанному действию
 * @param {string} action действие относительно сервера (GET_PHOTOS_DATA или SEND_USER_DATA)
 * @param {FormData} body - тело запроса в виде FormData
 * @returns {Promise} возвращает промис обращения к серверу
 */
function fetchToServer (action, body = null) {
  return fetch(`${SERVER_URL}${ACTIONS[action].ROUTE}`, { method: ACTIONS[action].METHOD, body: body })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Проблема — ${response.status}, ${response.statusText}`);
      }
      return response.json();
    })
    .catch((error) => {
      throw error;
    });
}

const getData = () => fetchToServer('GET_PHOTOS_DATA');
const sendData = (body) => fetchToServer('SEND_USER_DATA', body);

export { getData, sendData };
