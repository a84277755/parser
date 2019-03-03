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
    return pageContent;
}

findTextBySelector(
    'https://youla.ru/moskva/dom-dacha/stoly-stulya/stol-kukhonnyi-i-taburietki-5c7ace6622a4495f1a168738', 
    'p[class=\"sc-kDgGX OHZMS sc-bdVaJa jqQFve\"][variant=\"caption5,caption4\"][color=\"primary\"]'
)
    .then(data => {
        console.log('Нашли: ', data);
    })
    .catch(e => {
        console.log(e);
    })