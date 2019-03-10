const puppeteer = require('puppeteer');
const findTextBySelector = async (url, selector) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitFor(500);
    await page.waitForSelector(selector, { timeout: 0 });
    const pageContent = await page.$eval(selector, 
    selector => selector.innerHTML);
    browser.close();
    console.log('URL: ' + url + '\nСелектор: ', selector + '\n Текст: ' + pageContent);
}

findTextBySelector(
    'https://www.cian.ru/sale/flat/202804816/', 
    'a[target=\"_blank\"][rel=\"noopener\"][class=\"a10a3f92e9--link--1t8n1 a10a3f92e9--link--2Aiso\"]'
)