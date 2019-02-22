const {getPageRequest} = require('./controllers/request-http');
const {createVirtualDOM} = require('./controllers/parse-tags');

getPageRequest('http://realtmsk.ru/uslugi/soprovozhdenie-sdelki').then(createVirtualDOM).then(virtualDOM => {
    console.log('virtualDOM FROM DOM: ', virtualDOM.document.documentElement.querySelector('h1').textContent);
}).catch(e => console.log('err: ', e));