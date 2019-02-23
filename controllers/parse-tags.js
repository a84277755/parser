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

// Найти непосредственно сам элемент
const findClosestTag = searchText => HTMLCode => {
    const pureHTMLCode = HTMLCode.replace(/&nbsp;/g,' ');
    const fastSearchResult = ~pureHTMLCode.indexOf(searchText);
    if (!fastSearchResult) {
        return Promise.reject({message: 'В HTML странице совпадения не найдены'});
    }
    const regExp = new RegExp('<([\\d\\w]{1,10})([\\s\\S]{0,200})>(.{0,3}' + getSafetyText(searchText) + '.{0,3})<\/\\1>');
    const result = pureHTMLCode.match(regExp);
    if (result) {
        let attributes = {};
        const foundAttributes = result[2].trim();
        if (foundAttributes) {
            foundAttributes.replace(/\s{2,}/g,' ').trim().split(' ').forEach(attribute => {
                if (/[><\/]/.test(attribute)) return false;
                const [key, value] = attribute.split('=');
                attributes[key] = value ? value.replace(/"/g, '') : true;
            })
        }
        return Promise.resolve({
            attributes,
            tagName: result[1],
            searchedText: searchText,
            resultText: result[3]
        });
    }
    return Promise.reject({message: 'В HTML странице совпадения не найдены'});
};

// Найти верхнего родителя с атрибутами
const findClosestTagWithAttributes = (searchText, {closestSymbolsStart, closestSymbolsEnd} = {closestSymbolsStart: 200, closestSymbolsEnd: 150}) => HTMLCode => {
    const pureHTMLCode = HTMLCode.replace(/&nbsp;/g,' ');
    const fastSearchResult = ~pureHTMLCode.indexOf(searchText);
    if (!fastSearchResult) {
        return Promise.reject({message: 'В HTML странице совпадения не найдены'});
    }
    const regExp = new RegExp('<([\\d\\w]{1,10})([\\s\\S]{5,200})>[\\s\\S]{0,' + closestSymbolsStart + '}<([\\d\\w]{1,10})([\\s\\S]{0,200})>(.{0,3}' + getSafetyText(searchText) + '.{0,3})<\/\\3>[\\s\\S]{0,' + closestSymbolsEnd + '}<\/\\1>');
    const result = pureHTMLCode.match(regExp);
    if (result) {
        let parentAttributes = {};
        let attributes = {};
        const foundAttributes = result[4].trim();
        const foundParrentAttributes = result[2].trim();
        if (!foundParrentAttributes) {
            return Promise.reject({message: 'В HTML странице совпадения не найдены (отсутствуют атрибуты у родителей)'});
        }
        if (foundAttributes) {
            foundAttributes.replace(/>.*/,'').replace(/\s{2,}/g,' ').trim().split(' ').forEach(attribute => {
                if (/[><\/]/.test(attribute)) return false;
                const [key, value] = attribute.split('=');
                attributes[key] = value ? value.replace(/"/g, '') : true;
            })
        }
        foundParrentAttributes.replace(/>.*/,'').replace(/\s{2,}/g,' ').trim().split(' ').forEach(attribute => {
            if (/[><\/]/.test(attribute)) return false;
            const [key, value] = attribute.split('=');
            parentAttributes[key] = value ? value.replace(/"/g, '') : true;
        })
        return Promise.resolve({
            attributes,
            parentAttributes,
            parentTagName: result[1],
            tagName: result[3],
            searchedText: searchText,
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