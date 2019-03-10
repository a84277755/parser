const http = require('http');
const {getOneSelector, getSelectorFromDifferentPages} = require('./controllers/get-selectors');

// @TODO find relative with closest neighbours (if you add neighbour - you will receive full content of children)

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

        Для проверки нескольких страниц используйте POST запрос (на любой URL) вида:
        [
            {
                "searchText": "Обеденный стол трансформер",
                "url": "https://youla.ru/moskva/dom-dacha/stoly-stulya/obiediennyi-stol-transformier-5c6e5d56c6ab9e2f9a3fc54c"
            },
            {
                "searchText": "Стол кухонный и табуретки",
                "url": "https://youla.ru/moskva/dom-dacha/stoly-stulya/stol-kukhonnyi-i-taburietki-5c7ace6622a4495f1a168738"
            }
        ]

        Для проверки только одной страницы используйте POST запрос вида:
        {
            "searchText": "Обеденный стол трансформер",
            "url": "https://youla.ru/moskva/dom-dacha/stoly-stulya/obiediennyi-stol-transformier-5c6e5d56c6ab9e2f9a3fc54c"
        }
    `);
}
    
}).listen(3123, () => {console.log('Слушаем 3123 порт')});