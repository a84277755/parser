// Здесь мы будем выбирать методики по поиску тегов
const {searchOnlyTag, searchById, searchByAllAttributes} = require('./learn-tags');

const chooseMethod = (options) => {
    const {attributes, tagName, searchedText, resultText} = options;
    const idExists = !!attributes.id;
    const hasAttributes = !!Object.keys(attributes).length;

    if (idExists) return searchById(options);
    if (hasAttributes) return searchByAllAttributes(options);
    return searchOnlyTag(options);
};

module.exports = {
    chooseMethod
};