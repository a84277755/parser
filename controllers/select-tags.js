//
// Здесь мы будем выбирать методики по поиску тегов
//
const {searchOnlyTag, searchById, searchByAttributes} = require('./learn-tags');

// Базовый поиск по тегу (находим ближайший текст к поисковой строке и его селектор)
const chooseMethodForSearchingOnlyTag = (options) => {
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
    if (hasAttributes) return searchByAttributes(options);
    return searchOnlyTag(options);
};

module.exports = {
    chooseMethodForSearchingOnlyTag
};