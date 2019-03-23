const puppeteer = require('puppeteer');

const URL = 'https://www.cian.ru/sale/flat/202802232/';
const elemsToSearch = [
    {
        description: 'Дата объявления',
        selector: 'div[class="a10a3f92e9--container--3nJ0d"]'
    },
    {
        description: 'Заголовок объявления',
        selector: 'h1[class="a10a3f92e9--title--2Widg"]'
    },
    {
        description: 'Изменения цены объявления',
        selector: 'td[class="price_history_widget-event-price-1hxoWz1dS"]'
    },
    {
        description: 'Текущая цена объявления',
        selector: 'span[itemprop="price"]'
    },
    {
        description: 'Адрес объявления',
        selector: 'a[class="a10a3f92e9--link--1t8n1 a10a3f92e9--address-item--1clHr"]'
    },
    {
        description: 'Телефон объявления',
        selector: 'a[class="a10a3f92e9--phone--3XYRR"]'
    },
    {
        description: 'Описание объявления',
        selector: 'p[itemprop="description"][class="a10a3f92e9--description-text--1_Lup"]'
    }
];

const findTextBySelector = async ({description, selector}) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(URL);
    try {
        await page.waitForSelector(selector, { timeout: 10000 });
        const pageContent = await page.$$eval(selector, nodes => nodes.map(n => n.innerText || n.innerHTML));
        browser.close();
        console.log(description + ': ' + pageContent.join(', '));
    } catch (e) {
        browser.close();
        console.log(description + ': ' + '*ДАННЫЕ ОТСУТСТВУЮТ*');
    }
}

console.log('URL: ', URL);
elemsToSearch.forEach(findTextBySelector);