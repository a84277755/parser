//
// Здесь происходит поиск по DOM дереву и возвращение результата
//
const {
    getSelectorFromAttributesFromString,
    getAttributesFromNode,
    getSelectorFromAttributesDOMNode,
    getArrayDomElementsWithParentSelector
} = require('../utils/selectors');
const {getBestParentSelector} = require('../utils/filter');
const defaultResultOptions = {
    result: false,
    selectedMethodic: {
        onlyTag: false,
        allAttributes: false,
        searchById: false,
        partialAttributes: false,
        searchWithParentAttributes: false,
    },
    elementsLength: 0,
    resultNumber: 0
};

// Найти информацию ТОЛЬКО по тегу
// Имеет смысл для заголовков (h*) и редких тегов
const searchOnlyTag = (options) => (virtualDOM) => {
    const resultObject = {
        ...defaultResultOptions,
        tagName: options.tagName,
        selectedMethodic: {
            ...defaultResultOptions.selectedMethodic,
            onlyTag: true
        },
        url: options.url || null
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
            resultObject.resultText = elem.textContent;
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
        },
        url: options.url || null
    };
    const allElements = virtualDOM.document.getElementById(options.attributes.id);
    if (!allElements) {
        return resultObject;
    }
    resultObject.elementsLength = 1;
    resultObject.resultNumber = 1;
    resultObject.resultText = allElements.textContent;
    resultObject.result = true;
    return resultObject;
};

// Поиск по атрибутам (по умолчанию по всем) (с указанием тега)
const searchByAttributes = (options, attributesToSkip = []) => (virtualDOM) => {
    const allAttributes = !attributesToSkip.length;
    let resultObject = {
        ...defaultResultOptions,
        tagName: options.tagName,
        selectedMethodic: {
            ...defaultResultOptions.selectedMethodic,
            allAttributes,
            partialAttributes: !allAttributes,
        },
        url: options.url || null
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
    const parsedAttributes = getSelectorFromAttributesFromString(attributes);
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
            resultObject.resultText = elem.textContent;
        }
    });
    return resultObject;
};


// Модификация предыдущих методов
// Поиск родителя (и определение его селектора) (поиск единственного результата)
const searchParentAndGetOnlyTag = (resultSearchingTag) => (virtualDOM) => {
    const {
        result,
        selectedMethodic,
        elementsLength,
        resultNumber,
        tagName,
        selector,
        url,
        resultText
    } = resultSearchingTag;
    if (!resultSearchingTag) {
        return Promise.reject({error: 'Результаты предыдущего поиска были неуспешны', lastResult: {...resultSearchingTag}});
    }
    if (!url) {
        return Promise.reject({error: 'Не пришел URL от прошлого запроса', lastResult: {...resultSearchingTag}});
    }

    // Если поиск по ID, то на нормальном сайте всего 1 результат и так будет
    if (selectedMethodic.searchById) {
        return Promise.resolve(resultSearchingTag);
    }

    const elementsByTag = virtualDOM.document.getElementsByTagName(tagName);
    if (elementsByTag.length !== elementsLength) {
        return Promise.reject({
            error: `Результаты текущего поиска отличаются от предыдущего (${elementsByTag.length} элементов стало)`,
            lastResult: {...resultSearchingTag}
        });
    }
    const neededElement = elementsByTag[resultNumber - 1];
    const bestSelector = getBestParentSelector({
        initialLength: elementsLength,
        lastLength: elementsLength,
        virtualDOM,
        oldSelector: tagName,
        baseNode: neededElement,
        url,
        resultText
    });
    return bestSelector;
};

module.exports = {
    searchOnlyTag,
    searchById,
    searchByAttributes,
    searchParentAndGetOnlyTag
};