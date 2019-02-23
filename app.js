const {getPageRequest} = require('./controllers/request-http');
const {createVirtualDOM, findClosestTag, findClosestTagWithAttributes} = require('./controllers/parse-tags');
const {chooseMethod} = require('./controllers/select-tags');

// getPageRequest('http://realtmsk.ru/uslugi/soprovozhdenie-sdelki').then(createVirtualDOM).then(virtualDOM => {
//     console.log('virtualDOM FROM DOM: ', virtualDOM.document.documentElement.querySelector('h1').textContent);
// }).catch(e => console.log('err: ', e));

// Обучение (получение информации)
// Пользователь указывает страницу и какую информацию он хочет извлечь (текст)
// Мы пытаемся найти информацию, запоминаем тег, аттрибуты
getPageRequest('https://spb.cian.ru/sale/flat/196629031/')    
    .then(htmlCode => {
        return findClosestTag('в ЖК «Legenda Комендантского (Легенда Комендантского)»')(htmlCode)
            .then(tag => {
                return createVirtualDOM(htmlCode)
                    .then(virtualDOM => {
                        console.log(chooseMethod(tag)(virtualDOM));
                    })
            })
    })
    .catch(e => console.log('Ошибка получени ответа от сервера: ', e));
    