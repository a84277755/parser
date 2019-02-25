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
const URL = 'https://www.pleer.ru/product_518027_240Gb_Silicon_Power_M10_mSATA_SP240GBSS3M10MFF.html';
const TEXT = 'Жесткий диск 240Gb - Silicon Power M10 mSATA SP240GBSS3M10MFF';
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
    