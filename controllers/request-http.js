//
// Здесь происходит получение HTML страницы
//
const https = require('https');
const http = require('http');
const iconv = require('iconv-lite');
const {isCharsetWindows1251, getClearedData} = require('../utils/encoding');

const createRequest = ({hostname, path, protocol}) => {
    const options = {
        hostname,
        path,
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'Host': hostname,
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36'
        }
    };
    const protocolHTTP = protocol === 'https' ? https : http;
    return new Promise((resolve, reject) => {
        const req = protocolHTTP.request(options, (res) => {
            if (res.statusCode !== 200) {
                return reject('Код ответа от сервера отличается от 200 (' + res.statusCode + ')');
            }
            const charsetWindows1251 = isCharsetWindows1251(res.headers['content-type']);
            let receivedData = '';

            if (!charsetWindows1251) {
                res.on('data', (chunk) => {
                    receivedData += getClearedData(chunk);            
                });
                res.on('end', () => {
                     resolve(receivedData);
                });
            } else {
                const converterStream = iconv.decodeStream('win1251');
                res.pipe(converterStream);
                converterStream.on('data', function(chunk) {
                    receivedData += getClearedData(chunk);
                });
                converterStream.on('end', () => {
                     resolve(receivedData);
                });
            }
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
        return Promise.reject('Некорректный протокол в URL, получен: ' + protocol);
    }
    const [hostname, ...pathArray] = URLadress.split('/');
    const path = '/' + pathArray.join('/');
    return createRequest({hostname, path, protocol});
};

module.exports = {getPageRequest};