// Здесь мы будем выбирать методики по поиску тегов
const {searchOnlyTag, searchById, searchByAllAttributes, searchByParentWithAttributesAndTag} = require('./learn-tags');

const chooseMethod = (options) => {
    const {
        attributes = {},
        parentAttributes = {},
        tagName,
        searchedText,
        resultText,
        parentTagName
    } = options;
    const idExists = !!attributes.id;
    const hasAttributes = !!Object.keys(attributes).length;
    const hasParrentAttributes = !!Object.keys(parentAttributes).length;

    if (idExists) return searchById(options);
    if (parentTagName && hasParrentAttributes) return searchByParentWithAttributesAndTag(options);
    if (hasAttributes) return searchByAllAttributes(options);
    return searchOnlyTag(options);
};

module.exports = {
    chooseMethod
};