const puppeteer = require('puppeteer');

const URL = 'https://www.cian.ru/sale/flat/202220058/';
const elemsToSearch = [
    {
        description: 'Дата обновления',
        selector: 'div[class="a10a3f92e9--container--3nJ0d"]'
    },
    {
        description: 'Заголовок обновления',
        selector: 'h1[class="a10a3f92e9--title--2Widg"]'
    },
    {
        description: 'Цена обновления',
        selector: 'td[class="price_history_widget-event-price-1hxoWz1dS"]'
    },
    {
        description: 'Адрес обновления',
        selector: 'a[class="a10a3f92e9--link--1t8n1 a10a3f92e9--address-item--1clHr"]'
    },
    {
        description: 'Телефон обновления',
        selector: 'a[class="a10a3f92e9--phone--3XYRR"]'
    },
    {
        description: 'Описание обновления',
        selector: 'p[itemprop="description"][class="a10a3f92e9--description-text--1_Lup"]'
    }
];

const findTextBySelector = async ({description, selector}) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(URL);
    await page.waitForSelector(selector, { timeout: 0 });
    const pageContent = await page.$$eval(selector, nodes => nodes.map(n => n.innerText || n.innerHTML));
    browser.close();
    console.log(description + ': ' + pageContent.join(', '));
}

console.log('URL: ', URL);
elemsToSearch.forEach(findTextBySelector);