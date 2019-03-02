const http = require('http');
const {getOneSelector, getSelectorFromDifferentPages} = require('./controllers/get-selectors');

http.createServer((req, res) => {
    if (req.url === '/favicon.ico') {
        res.statusCode = 404;
        return res.end();
    }

    if (req.method === 'POST') {
        let body = '';
        req.on('data', function(data) {
            body += data.toString();
        })
        req.on('end', function() {
            let parsedBody;
            try {
                parsedBody = JSON.parse(body);
            }
            catch (e) {
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end({"error": "Проблема получения данных, проверьте, пожалуйста, наличие всех данных и корректных типов"})
            }
            
            if (parsedBody && typeof parsedBody === 'object') {
                const parseMethod = parsedBody.length ? getSelectorFromDifferentPages : getOneSelector;
                return parseMethod(parsedBody)
                    .then(data => {
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        return res.end(JSON.stringify(data));
                    })
                    .catch(err => {
                        res.writeHead(400, {'Content-Type': 'application/json'});
                        return res.end(JSON.stringify(err));
                    });
            }

            res.writeHead(400, {'Content-Type': 'application/json'});
            return res.end('Отправили некорректный тип данных');
        });
    } else {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
    return res.end(`
        searchText (string, обязательный параметр) - текст для поиска на странице (+- 3 символа слева и справа)
        url (string, обязательный параметр) - URL, который будет парситься
        htmlAnotherWayToReceive (boolean, не обязательный параметр) - для парсинга использовать альтернативный способ (через puppeteer, для CSR React и др.) 

        Для проверки нескольких страниц используйте POST запрос (на любой URL) вида:
        [
            {
                "searchText": "Обеденный стол трансформер",
                "url": "https://youla.ru/moskva/dom-dacha/stoly-stulya/obiediennyi-stol-transformier-5c6e5d56c6ab9e2f9a3fc54c",
                "htmlAnotherWayToReceive": true
            },
            {
                "searchText": "Стол кухонный и табуретки",
                "url": "https://youla.ru/moskva/dom-dacha/stoly-stulya/stol-kukhonnyi-i-taburietki-5c7ace6622a4495f1a168738",
                "htmlAnotherWayToReceive": true
            }
        ]

        Для проверки только одной страницы используйте POST запрос вида:
        {
            "searchText": "Обеденный стол трансформер",
            "url": "https://youla.ru/moskva/dom-dacha/stoly-stulya/obiediennyi-stol-transformier-5c6e5d56c6ab9e2f9a3fc54c",
            "htmlAnotherWayToReceive": true
        }
    `);
}
    
}).listen(3123, () => {console.log('Слушаем 3123 порт')});