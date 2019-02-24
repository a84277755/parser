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
    const allAttributes = !attributesToSkip.length;
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
        }
    });
    return resultObject;
};


// Модификация предыдущих методов
// Поиск родителя (и определение его селектора) (поиск единственного результата)
const searchParentAndGetOnlyTag = (resultSearchingTag) => (virtualDOM) => {
    const {result, selectedMethodic, elementsLength, resultNumber, tagName, selector} = resultSearchingTag;
    if (!resultSearchingTag) {
        return {error: 'Результаты предыдущего поиска были неуспешны', lastResult: {...resultSearchingTag}};
    }

    // Если поиск по ID, то на нормальном сайте всего 1 результат и так будет
    if (selectedMethodic.searchById) {
        return resultSearchingTag;
    }

    // Самые слабые результаты у поиска только по тегу
    if (selectedMethodic.onlyTag) {
        const elementsByTag = virtualDOM.document.getElementsByTagName(tagName);
        if (elementsByTag.length !== elementsLength) {
            return {
                error: `Результаты текущего поиска отличаются от предыдущего (${elementsByTag.length} элементов стало)`,
                lastResult: {...resultSearchingTag}
            };
        }
        const neededElement = elementsByTag[resultNumber - 1];
        const bestSelector = getBestParentSelector({
            initialLength: elementsLength,
            lastLength: elementsLength,
            virtualDOM,
            oldSelector: tagName,
            baseNode: neededElement
        });
        return bestSelector;
    }
};

module.exports = {
    searchOnlyTag,
    searchById,
    searchByAttributes,
    searchParentAndGetOnlyTag
};