//
// Здесь происходит преобразование HTML страницы в объект с параметрами
//
const {JSDOM} = require("jsdom");
const {getSafetyText} = require('../configs/parsing');
const {getAttributesFromFoundString} = require('../utils/tags');

const createVirtualDOM = (HTMLCode) => {
    try {
        const virtualDOM = (new JSDOM(HTMLCode)).window;
        return Promise.resolve(virtualDOM);
    } catch ( error ) {
        return Promise.reject("Ошибка создания виртуального DOM: " + error);
    }
};

// Найти непосредственно сам элемент
const findClosestTag = searchText => HTMLCode => {
    const text = searchText.toLowerCase();
    const fastSearchResult = ~HTMLCode.indexOf(text);
    if (!fastSearchResult) {
        return Promise.reject({message: 'В HTML странице совпадения не найдены'});
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
            resultText: result[3]
        });
    }
    return Promise.reject({message: 'В HTML странице совпадения не найдены'});
};

// Найти верхнего родителя с атрибутами
const findClosestTagWithAttributes = (
    searchText,
    {closestSymbolsStart, closestSymbolsEnd} = {closestSymbolsStart: 200, closestSymbolsEnd: 150}
) => HTMLCode => {
    const text = searchText.toLowerCase();
    const fastSearchResult = ~HTMLCode.indexOf(text);
    if (!fastSearchResult) {
        return Promise.reject({message: 'В HTML странице совпадения не найдены'});
    }
    const regExp = new RegExp('<([\\d\\w]{1,10})([\\s\\d\\w\'\"\;\#\-\=]{5,200})>[\\s\\S]{0,' + closestSymbolsStart + '}<([\\d\\w]{1,10})([\\s\\d\\w\'\"\;\#\-\=]{0,200})>(.{0,3}' + getSafetyText(text) + '.{0,3})<\/\\3>[\\s\\S]{0,' + closestSymbolsEnd + '}<\/\\1>');
    const result = HTMLCode.match(regExp);
    if (result) {
        const foundAttributes = result[4].trim();
        const foundParrentAttributes = result[2].trim();
        if (!foundParrentAttributes) {
            return Promise.reject({message: 'В HTML странице совпадения не найдены (отсутствуют атрибуты у родителей)'});
        }
        
        const parentAttributesParsed = getAttributesFromFoundString(foundParrentAttributes);
        const attributesParsed = getAttributesFromFoundString(foundAttributes);
        return Promise.resolve({
            attributes: {...attributesParsed},
            parentAttributes: {...parentAttributesParsed},
            parentTagName: result[1],
            tagName: result[3],
            searchedText: text,
            resultText: result[5]
        });
    }
    return Promise.reject({message: 'В HTML странице совпадения не найдены'});
};

module.exports = {
    createVirtualDOM,
    findClosestTag,
    findClosestTagWithAttributes
};