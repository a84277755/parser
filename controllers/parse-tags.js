const {JSDOM} = require("jsdom");
const {getSafetyText} = require('../configs/parsing');
// Необходимо будет разделить поиск тегов по смыслу
// Поиск таблицы, изображения и т.п.

const createVirtualDOM = (HTMLCode) => {
    try {
        const virtualDOM = (new JSDOM(HTMLCode)).window;
        return Promise.resolve(virtualDOM);
    } catch ( error ) {
        return Promise.reject("Ошибка создания виртуального DOM: " + error);
    }
};

const findClosestTag = searchText => HTMLCode => {
    const pureHTMLCode = HTMLCode.replace(/&nbsp;/g,' ');
    const regExp = new RegExp(`<([\\d\\w]{1,10})([\\s\\S]{0,100})>(.{0,3}${getSafetyText(searchText)}.{0,3})<\/.{1,10}>`);
    const result = pureHTMLCode.match(regExp);
    if (result) {
        let attributes = null;
        const foundAttributes = result[2].trim();
        if (foundAttributes) {
            attributes = {};
            foundAttributes.replace(/\s{2,}/g,' ').trim().split(' ').forEach(attribute => {
                const [key, value] = attribute.split('=');
                attributes[key] = value ? value.replace(/"/g, '') : true;
            })
        }
        return {
            attributes,
            tagName: result[1],
            searchedText: searchText,
            resultText: result[3]
        };
    }
    return null;
};

module.exports = {
    createVirtualDOM,
    findClosestTag
};