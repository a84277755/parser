const http = require('http');
const {getOneSelector} = require('./controllers/get-selectors');

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
                return getOneSelector(parsedBody)
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
        searchText (string, обязательный параметр) - текст для поиска на странице (+- 2000 символов слева и справа)
        url (string, обязательный параметр) - URL, который будет парситься

        Для проверки одной страницы используйте POST запрос вида:
        {
            "searchText": "2-комн. квартира, 47,2 м²",
            "url": "https://www.cian.ru/sale/flat/202220058/"
        }
    `);
}
    
}).listen(3123, () => {console.log('Слушаем 3123 порт')});