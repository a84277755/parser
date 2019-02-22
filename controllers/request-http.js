const https = require('https');
const http = require('http');
const fs = require('fs');

const createRequest = ({hostname, path, protocol}) => {
    const options = {hostname,path};
    const protocolHTTP = protocol === 'https' ? https : http;
    return new Promise((resolve, reject) => {
        const req = protocolHTTP.request(options, (res) => {
            if (res.statusCode !== 200) {
                return reject('Код ответа от сервера отличается от 200 (' + res.statusCode + ')');
            }
            let receivedData = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                receivedData += chunk.toString();
            });
            res.on('end', () => {
              resolve(receivedData);
            });
        });
          
        req.on('error', (e) => {
            reject('Ошибка отправки HTTP запроса: ' + e);
        });
        req.end();
    });    
};

const getPageRequest = (url) => {
    const [protocol, URLadress] = url.split('://');
    if (protocol !== 'http' && protocol !== 'https') {
        throw new Error('Некорректный протокол в URL');
    }
    const [hostname, ...pathArray] = URLadress.split('/');
    const path = pathArray.join('/');
    return createRequest({hostname, path, protocol});
};

module.exports = {
    getPageRequest
};