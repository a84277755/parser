const {getAttributesFromString} = require('../utils/selectors');
// Найти информацию ТОЛЬКО по тегу
// Имеет смысл для заголовков (h*) и редких тегов
const defaultResultOptions = {
    result: false,
    onlyTag: false,
    allAttributes: false,
    searchById: false,
    searchWithParantAttributes: false,
    elementsLength: 0,
    resultNumber: 0
};

const searchOnlyTag = (options) => (virtualDOM) => {
    let resultObject = {
        ...defaultResultOptions,
        onlyTag: true,
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
        ...defaultResultOptions,
        searchById: true,
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
        ...defaultResultOptions,
        allAttributes: true,
        tagName: options.tagName
    };
    const {tagName} = options;
    const parsedAttributes = getAttributesFromString(options.attributes);
    const selector = `${tagName}${parsedAttributes}`
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


// Поиск по ВСЕМ атрибутам (с указанием тега)
const searchByParentWithAttributesAndTag = (options) => (virtualDOM) => {
    let resultObject = {
        ...defaultResultOptions,
        searchWithParantAttributes: true,
        tagName: options.tagName
    };
    if (!options.parentAttributes || !options.parentTagName || !options.tagName) {
        return resultObject;
    }
    const {parentTagName, tagName} = options;

    const parsedParentAttributes = getAttributesFromString(options.parentAttributes);
    const parsedAttributes = getAttributesFromString(options.attributes);

    const selector = `${parentTagName}${parsedParentAttributes} ${tagName}${parsedAttributes}`
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
    searchByAllAttributes,
    searchByParentWithAttributesAndTag
};