const {getOneSelector, getSelectorFromDifferentPages} = require('./controllers/get-selectors');

// Основная задача - поиск нужного селектора

// ВНИМАНИЕ: при обычном поиске нам нужно будет только смонтировать виртуальный дом и по селектору достать значение
// В режиме эксплутации действия будут значительно быстрее (сделать создание DOM при загрузке страницы)
// getPageRequest('http://realtmsk.ru/uslugi/soprovozhdenie-sdelki').then(createVirtualDOM).then(virtualDOM => {
//     console.log('virtualDOM FROM DOM: ', virtualDOM.document.documentElement.querySelector('h1').textContent);
// }).catch(e => console.log('err: ', e));

// Обучение (получение информации)
// Пользователь указывает страницу и какую информацию он хочет извлечь (текст)
// Мы пытаемся найти информацию, запоминаем тег, аттрибуты
const URL = 'https://www.cian.ru/sale/flat/199599856/';
const TEXT = '23 м';
const dataToParse = [
    {searchText: 'Апартаменты-студия, 45 м', url: 'https://www.cian.ru/sale/flat/197560571/'},
    {searchText: '3-комн. квартира, 139 м', url: 'https://www.cian.ru/sale/flat/200992024/'},
    {searchText: '3-комн. квартира, 145 м', url: 'https://www.cian.ru/sale/flat/200992028/'}
];
// вынести в отдельный метод с промисом, возвращает селектор в промисе
// добавить возможность прогнать пачку ключей для одной страницы
// Сделать отдельный общий метод, который принимает объект {url, keys} и прогнать пачкой
// getOneSelector({url: URL, searchText: TEXT})
//     .then(selector => {
//         console.log(selector);
//     })
//     .catch(e => {
//         console.log('error: ', e);
//     });
    
getSelectorFromDifferentPages(dataToParse)
    .then(selectors => {
        console.log(selectors.map(({selector}) => selector));
    })
    .catch(e => {
        console.log('error: ', e);
    });