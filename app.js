const {getPageRequest} = require('./controllers/request-http');
const {createVirtualDOM, findClosestTag} = require('./controllers/parse-tags');
const {chooseMethodForSearchingOnlyTag} = require('./controllers/select-tags');
const {searchParentAndGetOnlyTag} = require('./controllers/learn-tags');

// Основная задача - поиск нужного селектора

// ВНИМАНИЕ: при обычном поиске нам нужно будет только смонтировать виртуальный дом и по селектору достать значение
// В режиме эксплутации действия будут значительно быстрее (сделать создание DOM при загрузке страницы)
// getPageRequest('http://realtmsk.ru/uslugi/soprovozhdenie-sdelki').then(createVirtualDOM).then(virtualDOM => {
//     console.log('virtualDOM FROM DOM: ', virtualDOM.document.documentElement.querySelector('h1').textContent);
// }).catch(e => console.log('err: ', e));

// Обучение (получение информации)
// Пользователь указывает страницу и какую информацию он хочет извлечь (текст)
// Мы пытаемся найти информацию, запоминаем тег, аттрибуты
const URL = 'https://www.vasmann.ru/dileram';
const TEXT = 'Стабильное немецкое качество продукции';
getPageRequest(URL)    
    .then(htmlCode => {
        return findClosestTag({searchText: TEXT, url: URL})(htmlCode)
            .then(tag => {
                return createVirtualDOM(htmlCode)
                    .then(virtualDOM => {
                        searchParentAndGetOnlyTag(chooseMethodForSearchingOnlyTag(tag)(virtualDOM))(virtualDOM)
                            .then(data => {
                                console.log("DATA : ", data);
                            });
                    })
            })
    })
    .catch(e => console.log('Ошибка получени ответа от сервера: ', e));
    