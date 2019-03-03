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
    'https://youla.ru/moskva/zhivotnye/sobaki/propala-sobaka-5c7be25766fb07948c282d37', 
    'p[class=\"sc-kDgGX OHZMS sc-bdVaJa jqQFve\"][variant=\"caption5,caption4\"][color=\"primary\"]'
)
    .catch(e => {
        console.log(e);
    })