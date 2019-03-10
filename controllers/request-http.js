//
// Здесь происходит получение HTML страницы
//
const puppeteer = require('puppeteer');
const {getClearedData} = require('../utils/encoding');

const getPageRequest = (url) => {
    if (!url || typeof url !== 'string' || !~url.indexOf('://')) {
        return Promise.reject({"error": "Некорректный URL"});
    }
    const [protocol] = url.split('://');

    if (protocol !== 'http' && protocol !== 'https') {
        return Promise.reject('Некорректный протокол в URL, получен: ' + protocol);
    }

    return Promise.resolve(getWithChromePageRequest(url));
};

const getWithChromePageRequest = async (url) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const bodyHandle = await page.$('body');
    const html = await page.evaluate(body => body.innerHTML, bodyHandle);
    browser.close();
    return getClearedData(html);
};

module.exports = {getPageRequest};