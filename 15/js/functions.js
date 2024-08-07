/**
 * Проверяет соответствие переданной строки заданной длине
 * @param {string} string - переданная для проверки строка
 * @param {int} maxLength - требуемая длина строки
 * @return {boolean} - true, если длина строки меньше maxLength
*/
function checkStringLength(string, maxLength) {
  return string.length <= maxLength;
}

checkStringLength('тестовая строка', 15);

/**
 * Проверяет, является ли переданная строка палиндромом
 * @param {string} string
 */
function palindromCheck(string) {
  string = string.toLowerCase().replaceAll(' ','');
  const newString = string.split('').reverse().join('');
  return newString === string;
}

palindromCheck('Лёша на полке клопа нашёл ');


/**
 * Преобразовывает строку времени в количество минут с начала дня (00:00)
 * @param {string} time - время в формате ЧЧ:ММ
 * @returns {number} - количество минут с начала рабочего дня
 */
function convertStringTime(time) {
  const [hoursStr, minutesStr] = time.split(':');
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);

  return hours * 60 + minutes;
}

/**
 * Проверяет укладывается ли встреча в рамки рабочего дня
 * @param {string} dayStartTime - начало рабочего дня
 * @param {string} dayEndTime - конец рабочего дня
 * @param {string} meetingStartTime - начало встречи
 * @param {number} meetingDuration - продолжительность встречи в минутах
 * @returns {boolean} - возвращает true, если встреча укладывается в рамки рабочего дня
 */
function checkMeetingDuration (dayStartTime, dayEndTime, meetingStartTime, meetingDuration) {
  const dayStart = convertStringTime(dayStartTime);
  const dayEnd = convertStringTime(dayEndTime);
  const meetingStart = convertStringTime(meetingStartTime);
  const meetingEnd = meetingStart + meetingDuration;

  return meetingStart >= dayStart && meetingEnd <= dayEnd;
}

checkMeetingDuration('08:00', '17:30', '14:00', 90);
checkMeetingDuration('8:0', '10:0', '8:0', 120);
checkMeetingDuration('08:00', '14:30', '14:00', 90);
checkMeetingDuration('14:00', '17:30', '08:0', 90);
checkMeetingDuration('8:00', '17:30', '08:00', 900);
