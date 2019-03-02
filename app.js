const {getOneSelector, getSelectorFromDifferentPages} = require('./controllers/get-selectors');
const {allSelectorsAreSame} = require('./utils/selectors');

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
    {searchText: 'Обработка заявки до 30 минут', url: 'https://www.vasmann.ru/dileram'},
    {searchText: 'Дополнительные скидки до 15% на крупный опт', url: 'https://www.vasmann.ru/dileram'},
    {searchText: 'Доставка герметиков', url: 'https://www.vasmann.ru/dileram'}
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
    
// getOneSelector(dataToParse[0])
//     .then(selector => {
//             console.log(selector);
//         })
//         .catch(e => {
//             console.log('error: ', e);
//         });

getSelectorFromDifferentPages(dataToParse)
    .then(selectors => {
        const modifiedSelectors = selectors.map(({selector}) => selector);
        if (allSelectorsAreSame(modifiedSelectors)) {
            return {
                allSelectorsAreSame: true,
                minSelectorFound: false,
                selector: modifiedSelectors[0],
                parsingInformation: selectors
            };
        } else {
            const resultSearchingCommonSelector = searchSamePathSelector(modifiedSelectors);
            if (resultSearchingCommonSelector.minSelectorFound) {
                return {
                    allSelectorsAreSame: false,
                    minSelectorFound: true,
                    selector: resultSearchingCommonSelector.selector,
                    parsingInformation: selectors
                };
            }
            return {
                allSelectorsAreSame: false,
                minSelectorFound: false,
                parsingInformation: selectors
            };
        }
    })
    .then(data => {
        console.log(data);
    })
    .catch(e => {
        console.log('error: ', e);
    });