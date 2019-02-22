const {getPageRequest} = require('./controllers/request-http');
const {createVirtualDOM, findClosestTag} = require('./controllers/parse-tags');

// getPageRequest('http://realtmsk.ru/uslugi/soprovozhdenie-sdelki').then(createVirtualDOM).then(virtualDOM => {
//     console.log('virtualDOM FROM DOM: ', virtualDOM.document.documentElement.querySelector('h1').textContent);
// }).catch(e => console.log('err: ', e));

getPageRequest('http://realtmsk.ru/ceny').then(htmlCode => {
    const tag = findClosestTag('90.000')(htmlCode);
    console.log('tag >> ', tag);
}).catch(e => console.log('err: ', e));