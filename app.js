const {getPageRequest} = require('./controllers/request-http');
const {createVirtualDOM, findClosestTag} = require('./controllers/parse-tags');
const {chooseMethod} = require('./controllers/select-tags');

// ВНИМАНИЕ: при обычном поиске нам нужно будет только смонтировать виртуальный дом и по селектору достать значение
// В режиме эксплутации действия будут значительно быстрее (сделать создание DOM при загрузке страницы)
// getPageRequest('http://realtmsk.ru/uslugi/soprovozhdenie-sdelki').then(createVirtualDOM).then(virtualDOM => {
//     console.log('virtualDOM FROM DOM: ', virtualDOM.document.documentElement.querySelector('h1').textContent);
// }).catch(e => console.log('err: ', e));

// Обучение (получение информации)
// Пользователь указывает страницу и какую информацию он хочет извлечь (текст)
// Мы пытаемся найти информацию, запоминаем тег, аттрибуты
getPageRequest('http://realtmsk.ru/')    
    .then(htmlCode => {
        return findClosestTag('Продажа недвижимости')(htmlCode)
            .then(tag => {
                return createVirtualDOM(htmlCode)
                    .then(virtualDOM => {
                        console.log(chooseMethod(tag)(virtualDOM));
                    })
            })
    })
    .catch(e => console.log('Ошибка получени ответа от сервера: ', e));
    