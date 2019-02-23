const {getPageRequest} = require('./controllers/request-http');
const {createVirtualDOM, findClosestTag} = require('./controllers/parse-tags');
const {searchOnlyTag, searchById, searchByAllTags} = require('./controllers/learn-tags');

// getPageRequest('http://realtmsk.ru/uslugi/soprovozhdenie-sdelki').then(createVirtualDOM).then(virtualDOM => {
//     console.log('virtualDOM FROM DOM: ', virtualDOM.document.documentElement.querySelector('h1').textContent);
// }).catch(e => console.log('err: ', e));

// Обучение (получение информации)
// Пользователь указывает страницу и какую информацию он хочет извлечь (текст)
// Мы пытаемся найти информацию, запоминаем тег, аттрибуты
getPageRequest('http://realtmsk.ru/uslugi/prodazha').then(htmlCode => {
    const tag = findClosestTag('Риэлтор по продаже недвижимости в Москве с выгодой для заказчика')(htmlCode);
    if (!tag) return Promise.reject('Значение не найдено');
    createVirtualDOM(htmlCode).then(virtualDOM => {
        if (tag.attributes.id) {
            console.log('Поиск по ID');
            console.log(searchById(tag)(virtualDOM));
        } else {
            console.log(searchByAllTags(tag)(virtualDOM));
        }
        
    })
}).catch(e => console.log('err: ', e));