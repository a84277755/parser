const {getAttributesFromString} = require('../utils/selectors');
// Найти информацию ТОЛЬКО по тегу
// Имеет смысл для заголовков (h*) и редких тегов
const defaultResultOptions = {
    result: false,
    selectedMethodic: {
        onlyTag: false,
        allAttributes: false,
        searchById: false,
        partialAttributes: false,
        searchWithParantAttributes: false,
    },
    elementsLength: 0,
    resultNumber: 0
};

const searchOnlyTag = (options) => (virtualDOM) => {
    const resultObject = {
        ...defaultResultOptions,
        tagName: options.tagName,
        selectedMethodic: {
            ...defaultResultOptions.selectedMethodic,
            onlyTag: true
        }
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
        tagName: options.tagName,
        attributeId: options.attributes.id,
        selectedMethodic: {
            ...defaultResultOptions.selectedMethodic,
            searchById: true
        }
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

// Поиск по атрибутам (по умолчанию по всем) (с указанием тега)
const searchByAttributes = (options, attributesToSkip = []) => (virtualDOM) => {
    const allAttributes = !!attributesToSkip.length;
    let resultObject = {
        ...defaultResultOptions,
        tagName: options.tagName,
        selectedMethodic: {
            ...defaultResultOptions.selectedMethodic,
            allAttributes,
            partialAttributes: !allAttributes,
        }
    };
    const attributes = {...options.attributes};
    const {tagName} = options;

    if (!Object.keys(attributes).length) {
        return false;
    }
    
    // remove not required props
    attributesToSkip.forEach(attribute => {
        delete attributes[attribute];
    });

    const parsedAttributes = getAttributesFromString(options.attributes);
    const selector = `${tagName}${parsedAttributes}`
    const allElements = virtualDOM.document.documentElement.querySelectorAll(selector);
    
    if (!allElements.length) {
        return resultObject;
    }

    resultObject.elementsLength = allElements.length;
    resultObject.selector = selector;
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
        tagName: options.tagName,
        selectedMethodic: {
            ...defaultResultOptions.selectedMethodic,
            searchWithParantAttributes: true
        }
    };
    if (!options.parentAttributes || !options.parentTagName || !options.tagName) {
        return false;
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
    resultObject.parentTagName = parentTagName;
    resultObject.selector = selector;
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
    searchByAttributes,
    searchByParentWithAttributesAndTag
};