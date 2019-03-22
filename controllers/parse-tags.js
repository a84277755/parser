//
// Здесь происходит преобразование HTML страницы в объект с параметрами
//
const {JSDOM} = require("jsdom");
const {getSafetyText} = require('../configs/parsing');
const {getAttributesFromFoundString} = require('../utils/tags');
const {getPageRequest} = require('./request-http');

const createVirtualDOM = (HTMLCode) => {
    try {
        const virtualDOM = (new JSDOM(HTMLCode)).window;
        return Promise.resolve(virtualDOM);
    } catch ( error ) {
        return Promise.reject("Ошибка создания виртуального DOM: " + error);
    }
};
const getVirtualDom = (url) => getPageRequest(url).then(createVirtualDOM);

// Найти непосредственно сам элемент
const findClosestTag = ({searchText, url}) => HTMLCode => {
    const fastSearchResult = ~HTMLCode.indexOf(searchText);
    if (!fastSearchResult) {
        return Promise.reject({message: 'В HTML странице совпадения не найдены (быстрый прогон)'});
    }
    const regExp = new RegExp('<([\\d\\w]{1,10})([\\s\\d\\w\'\"\;\#\-\=]{0,200})>([^\>\<]{0,2000}' + getSafetyText(searchText) + '[^\<\>]{0,2000})<\/\\1>');
    const result = HTMLCode.match(regExp);
    if (result) {
        let attributes = {};
        const foundAttributes = result[2].trim();
        const attributesParsed = getAttributesFromFoundString(foundAttributes);
        return Promise.resolve({
            attributes: {...attributesParsed},
            tagName: result[1],
            searchedText: searchText,
            resultText: result[3],
            url: url || null
        });
    }
    return Promise.reject({message: 'В HTML странице совпадения не найдены'});
};

module.exports = {
    createVirtualDOM,
    findClosestTag,
    getVirtualDom
};
