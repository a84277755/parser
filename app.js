const {getPageRequest} = require('./controllers/request-http');
const {createVirtualDOM, findClosestTag} = require('./controllers/parse-tags');
const {searchOnlyTag, searchById} = require('./controllers/learn-tags');

// getPageRequest('http://realtmsk.ru/uslugi/soprovozhdenie-sdelki').then(createVirtualDOM).then(virtualDOM => {
//     console.log('virtualDOM FROM DOM: ', virtualDOM.document.documentElement.querySelector('h1').textContent);
// }).catch(e => console.log('err: ', e));

// Обучение (получение информации)
// Пользователь указывает страницу и какую информацию он хочет извлечь (текст)
// Мы пытаемся найти информацию, запоминаем тег, аттрибуты
getPageRequest('https://www.cian.ru/sale/flat/195731653/').then(htmlCode => {
    const tag = findClosestTag('Покупаете в ипотеку?')(htmlCode);
    if (!tag) return Promise.reject('Значение не найдено');
    createVirtualDOM(htmlCode).then(virtualDOM => {
        console.log(searchById(tag)(virtualDOM));
    })
}).catch(e => console.log('err: ', e));