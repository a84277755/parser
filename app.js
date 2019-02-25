const {getOneSelector} = require('./controllers/get-selectors');

// Основная задача - поиск нужного селектора

// ВНИМАНИЕ: при обычном поиске нам нужно будет только смонтировать виртуальный дом и по селектору достать значение
// В режиме эксплутации действия будут значительно быстрее (сделать создание DOM при загрузке страницы)
// getPageRequest('http://realtmsk.ru/uslugi/soprovozhdenie-sdelki').then(createVirtualDOM).then(virtualDOM => {
//     console.log('virtualDOM FROM DOM: ', virtualDOM.document.documentElement.querySelector('h1').textContent);
// }).catch(e => console.log('err: ', e));

// Обучение (получение информации)
// Пользователь указывает страницу и какую информацию он хочет извлечь (текст)
// Мы пытаемся найти информацию, запоминаем тег, аттрибуты
const URL = 'https://toster.ru/q/353548';
const TEXT = 'Как конвертировать с windows-1251 в utf-8?';
// вынести в отдельный метод с промисом, возвращает селектор в промисе
// добавить возможность прогнать пачку ключей для одной страницы
// Сделать отдельный общий метод, который принимает объект {url, keys} и прогнать пачкой
getOneSelector({url: URL, searchText: TEXT})
    .then(selector => {
        console.log(selector);
    })
    .catch(e => {
        console.log('error: ', e);
    });
    