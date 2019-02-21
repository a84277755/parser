// Parse объявление
const https = require('https');
const fs = require('fs');

const options = {
    hostname: 'www.cian.ru',
    port: 443,
    path: '/sale/flat/200379269/',
    method: 'GET'
  };

  const req = https.request(options, ((res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);
    const stream = fs.createWriteStream('html.txt');
    let tempData = '';
  res.on('data', (d) => {
    stream.write(d);
    tempData += d.toString();
  });
  res.on('end', () => {
    const prepairedData = getData();
    console.log(prepairedData(tempData));
  });
}));

req.on('error', (e) => {
    console.error(e);
  });
  req.end();

function getData() {
    const file = {};
    const checkData = ({
        data,
        regExpression,
        additionalRegExpression,
        key,
        numberOfElemToResult = 0,
        global = false
    }) => {
        const searchedData = data.match(regExpression);
        if (searchedData) {
            if (global && additionalRegExpression) {
                file[key] = searchedData.map(elem => elem.match(additionalRegExpression)[1]);
            } else {
                file[key] = global ? searchedData : searchedData[numberOfElemToResult];
            }
            return true;
        }
        return null;
    };

    return (data) => {
        const title = checkData({
            data,
            regExpression: /<h1 class=".{0,30}">(.{0,100})<\/h1>/,
            key: 'title',
            numberOfElemToResult: 1
        });
        const address = checkData({
            data,
            regExpression: /<span itemProp="name" content="(.{0,150})"><\/span>/,
            key: 'address',
            numberOfElemToResult: 1
        });
        const transportType = checkData({
            data,
            regExpression: /<span itemProp="name" content="(.{0,150})"><\/span>/,
            key: 'transportType',
            numberOfElemToResult: 0
        });
        const description = checkData({
            data,
            regExpression: /<meta property="og:description" content="(.{0,2000})"?\s\/>/,
            key: 'description',
            numberOfElemToResult: 1
        });
        const phone = checkData({
            data,
            regExpression: /<a href="tel:(\+\d{9,15})" class=".{0,100}<\/a>/g,
            key: 'phone',
            numberOfElemToResult: 0,
            global: true,
            additionalRegExpression: /"tel:(\+\d{9,15})"/
        });
        const cyanPhotosData = data.match(/window._cianConfig\['offer-card'\] = \[.{0,100000}\"photos":(\[.{0,100000}"\}\]).{0,100000}\];/);
        if (cyanPhotosData) {
            console.log('cyanPhotosData[1] >> ', cyanPhotosData[1].length);
            file.cyanPhotosData = cyanPhotosData[1].replace(/\\u002F/g, '/');
        }        
        return file;
    };
};