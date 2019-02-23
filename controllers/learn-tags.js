// Найти информацию ТОЛЬКО по тегу
// Имеет смысл для заголовков (h*) и редких тегов
const searchOnlyTag = (options) => (virtualDOM) => {
    let resultObject = {
        result: false,
        onlyTag: true,
        allAttributes: false,
        elementsLength: 0,
        resultNumber: 0,
        tagName: options.tagName
    };
    const allElements = virtualDOM.document.getElementsByTagName(options.tagName);
    if (!allElements.length) {
        return resultObject;
    }
    resultObject.elementsLength = allElements.length;
    [...allElements].forEach((elem, id) => {
        if (!resultObject.result && elem.textContent === options.resultText) {
            resultObject.result = true;
            resultObject.resultNumber = id + 1;
        }
    });
    return resultObject;
};

// Эффективный способ, но не часто пригодится
const searchById = (options) => (virtualDOM) => {
    if (!options.attributes.id) {
        return false;
    }
    let resultObject = {
        result: false,
        onlyTag: false,
        allAttributes: false,
        searchById: true,
        elementsLength: 0,
        resultNumber: 0,
        tagName: options.tagName,
        attributeId: options.attributes.id
    };
    const allElements = virtualDOM.document.getElementById(options.attributes.id);
    if (!allElements) {
        return resultObject;
    }
    resultObject.elementsLength = 1;
    resultObject.resultNumber = 1;
    resultObject.result = true;
    return resultObject;
};

// Поиск по ВСЕМ атрибутам (с указанием тега)
const searchByAllAttributes = (options) => (virtualDOM) => {
    let resultObject = {
        result: false,
        onlyTag: false,
        allAttributes: true,
        elementsLength: 0,
        resultNumber: 0,
        tagName: options.tagName
    };
    const attributes = Object.keys(options.attributes).reduce((result, key) => {
        const selector = options.attributes[key] === true ? key : `${key}="${options.attributes[key]}"`;
        return `${result}[${selector}]`;
    }, '');
    const selector = `${options.tagName}${attributes}`
    const allElements = virtualDOM.document.documentElement.querySelectorAll(selector);
    if (!allElements.length) {
        return resultObject;
    }
    resultObject.elementsLength = allElements.length;
    allElements.forEach((elem, id) => {
        if (!resultObject.result && elem.textContent === options.resultText) {
            resultObject.result = true;
            resultObject.resultNumber = id + 1;
        }
    });
    return resultObject;
};

module.exports = {
    searchOnlyTag,
    searchById,
    searchByAllAttributes
};