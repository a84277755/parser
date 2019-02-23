const getAttributesFromString = (attributes) => Object.keys(attributes).reduce((result, key) => {
    const selector = attributes[key] === true ? key : `${key}="${attributes[key]}"`;
    return `${result}[${selector}]`;
}, '');

module.exports = {
    getAttributesFromString
};