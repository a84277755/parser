// Найти информацию ТОЛЬКО по тегу
const searchOnlyTag = (options) => (virtualDOM) => {
    let resultObject = {
        result: false,
        onlyTag: true,
        elementsLength: 0,
        resultNumber: 0,
        tagName: options.tagName
    };
    const allElements = virtualDOM.document.documentElement.querySelectorAll(`${options.tagName}`);
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

const searchById = (options) => (virtualDOM) => {
    if (!options.attributes || !options.attributes.id) {
        return false;
    }
    let resultObject = {
        result: false,
        onlyTag: false,
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

module.exports = {
    searchOnlyTag,
    searchById
};