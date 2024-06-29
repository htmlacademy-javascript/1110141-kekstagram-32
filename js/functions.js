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
