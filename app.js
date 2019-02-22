const {getPageRequest} = require('./controllers/request-http');

getPageRequest('https://realtmsk.ru').then(data => {console.log(data)}).catch(e => console.log('err: ', e));