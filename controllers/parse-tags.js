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
    const text = searchText.toLowerCase();
    const fastSearchResult = ~HTMLCode.indexOf(text);
    if (!fastSearchResult) {
        return Promise.reject({message: 'В HTML странице совпадения не найдены (быстрый прогон)'});
    }
    const regExp = new RegExp('<([\\d\\w]{1,10})([\\s\\d\\w\'\"\;\#\-\=]{0,200})>(.{0,3}' + getSafetyText(text) + '.{0,3})<\/\\1>');
    const result = HTMLCode.match(regExp);
    if (result) {
        let attributes = {};
        const foundAttributes = result[2].trim();
        const attributesParsed = getAttributesFromFoundString(foundAttributes);
        return Promise.resolve({
            attributes: {...attributesParsed},
            tagName: result[1],
            searchedText: text,
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

// Пробовал поиск через регулярку родительских тегов с параметрами
// Но это ресурсозатратная и неэффективная мера, лучше перенести поиск
// на virtualDOM (были проблемы с поиском родительского тега, далеко заходил поиск)