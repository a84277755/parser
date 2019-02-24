// Селектор получаем из объекта
const getSelectorFromAttributesFromString = (attributes) => Object.keys(attributes).reduce((result, key) => {
    const selector = attributes[key] === true ? key : `${key}="${attributes[key]}"`;
    return `${result}[${selector}]`;
}, '');

// Селектор получаем из DOM узла
const getAttributesFromNode = (DOMNode) => {
    const attributes = [...DOMNode.attributes];
    if (!attributes.length) return null;
    return attributes.reduce((result, attributeKey) => {
        return {...result, [attributeKey.nodeName]: attributeKey.nodeValue || true};
    }, {});
};

const getSelectorFromAttributesDOMNode = (DOMNode) => 
    `${DOMNode.tagName.toLowerCase()}${getSelectorFromAttributesFromString(getAttributesFromNode(DOMNode))}`;


const getParentSelectorInformation = ({virtualDOM, oldSelector, baseNode}) => {
    let parentNode = baseNode.parentNode;
    const badTagReceived = parentNode.tagName === 'BODY' || parentNode.tagName === 'HEAD'|| parentNode.tagName === 'HTML';
    if (badTagReceived) return {badTag: true};
    let parentSelector = getSelectorFromAttributesDOMNode(parentNode);
    let newSelector = `${parentSelector} ${oldSelector}`;    
    return {length: virtualDOM.document.querySelectorAll(newSelector).length, selector: newSelector, oldSelector, badTag: false};
};


module.exports = {
    getSelectorFromAttributesFromString,
    getAttributesFromNode,
    getSelectorFromAttributesDOMNode,
    getParentSelectorInformation
};