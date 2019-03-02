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
const dataToParse = [
    {
        searchText: 'Обеденный стол трансформер',
        url: 'https://youla.ru/moskva/dom-dacha/stoly-stulya/obiediennyi-stol-transformier-5c6e5d56c6ab9e2f9a3fc54c',
        htmlAnotherWayToReceive: true
    },
    {
        searchText: 'Стол кухонный и табуретки',
        url: 'https://youla.ru/moskva/dom-dacha/stoly-stulya/stol-kukhonnyi-i-taburietki-5c7ace6622a4495f1a168738',
        htmlAnotherWayToReceive: true
    },
    // {
    //     searchText: 'Доставка герметиков',
    //     url: 'https://www.vasmann.ru/dileram',
    //     htmlAnotherWayToReceive: true
    // }
];
// вынести в отдельный метод с промисом, возвращает селектор в промисе
// добавить возможность прогнать пачку ключей для одной страницы
// Сделать отдельный общий метод, который принимает объект {url, keys} и прогнать пачкой
// getOneSelector(dataToParse[0])
//     .then(selector => {
//         console.log(selector);
//     })
//     .catch(e => {
//         console.log('error: ', e);
//     });

getSelectorFromDifferentPages(dataToParse)
    .then(data => {
        console.log(data);
    })
    .catch(e => {
        console.log('error: ', e);
    });

