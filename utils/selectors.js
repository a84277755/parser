const {tagsToBreakParsing, tagsToContinueParsing} = require('../configs/parsing');
// Селектор получаем из объекта
const getSelectorFromAttributesFromString = (attributes) => Object.keys(attributes).reduce((result, key) => {
    const selector = attributes[key] === true ? key : `${key}="${attributes[key]}"`;
    return `${result}[${selector}]`;
}, '');

// Селектор получаем из DOM узла
const getAttributesFromNode = (DOMNode) => {
    const attributes = [...DOMNode.attributes];
    if (!attributes.length) return [];
    return attributes.reduce((result, attributeKey) => {
        return {...result, [attributeKey.nodeName]: attributeKey.nodeValue || true};
    }, {});
};

const getSelectorFromAttributesDOMNode = (DOMNode) => 
    `${DOMNode.tagName.toLowerCase()}${getSelectorFromAttributesFromString(getAttributesFromNode(DOMNode))}`;


const getParentSelectorInformation = ({virtualDOM, oldSelector, baseNode}) => {
    let parentNode = baseNode.parentNode;
    const badTagReceived = tagsToBreakParsing.includes(parentNode.tagName);
    if (badTagReceived) return {badTag: true};
    let parentSelector = getSelectorFromAttributesDOMNode(parentNode);
    const needToContinueParsing = tagsToContinueParsing.includes(parentNode.tagName);
    let newSelector = `${parentSelector} ${oldSelector}`;    
    return {
        length: virtualDOM.document.querySelectorAll(newSelector).length,
        selector: newSelector,
        oldSelector,
        badTag: false,
        needToContinueParsing
    };
};

allSelectorsAreSame = (selectors) => {
    if (!selectors && !selectors.length) return false;
    const [baseSelector, ...anySelectors] = selectors;
    return !anySelectors.some(selector => selector !== baseSelector);
};

// Данный метод вызывается когда присутствует хотя бы 1 отличный селектор
searchSamePathSelector = (selectors) => {
    if (!selectors && !selectors.length) return false;
    const differentSelectors = selectors.reduce((result, selector) => 
        result.find(savedSelector => savedSelector === selector) ? result : [...result, selector]
    , []);
    const selectorsByParts = differentSelectors.map(selector => selector.split(' '));

    // Определим, отличаются ли единственные селекторы
    let problemWithChoseSelector = false;
    selectorsByParts.forEach((selector, i, arr) => {
        if (
            !problemWithChoseSelector &&
            selector.length === 1 && 
            arr.some(anotherSelector => anotherSelector.length === 1 && selector[0] !== anotherSelector[0])
        )   {
                problemWithChoseSelector = true;
            }
    });
    if (problemWithChoseSelector) {
        return {error: 'Базовые селекторы отличаются, возможно, вы выбрали не идентичные участки для поиска селектора'};
    }

    // Поиск минимального общего решения
    // Здесь мы можем делить по ' ', т.к. ищем полное минимальное совпадение
    const [minLengthSplittedSelector, ...otherSplittedSelectors] = selectorsByParts.sort((a, b) => a.length > b.length ? 1 : -1);
    let minSelectorFound = otherSplittedSelectors.reduce((result, selectorByPaths) => {
        const allPathsFound = minLengthSplittedSelector.reduce((pathsFound, selectorPath) => 
            [...pathsFound, !!selectorByPaths.find(otherSelectorsPath => selectorPath === otherSelectorsPath)]
        ,[]).every(minPathFound => minPathFound);
        return [...result, allPathsFound];
    }, []).every(selectorFound => selectorFound);
    if (minSelectorFound) {
        return {
            minSelectorFound,
            selector: minLengthSplittedSelector.join(' ')
        }
    }

    return

}

module.exports = {
    getSelectorFromAttributesFromString,
    getAttributesFromNode,
    getSelectorFromAttributesDOMNode,
    getParentSelectorInformation,
    allSelectorsAreSame
};