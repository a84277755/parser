const {getPageRequest} = require('./request-http');
const {createVirtualDOM, findClosestTag} = require('./parse-tags');
const {chooseMethodForSearchingOnlyTag} = require('./select-tags');
const {searchParentAndGetOnlyTag} = require('./learn-tags');

// Get only one selector from web page
const getOneSelector = ({url, searchText}) => {
    return getPageRequest(url)
        .then(htmlCode => {
            return findClosestTag({searchText, url})(htmlCode)
                .then(tag => {
                    return createVirtualDOM(htmlCode)
                        .then(virtualDOM => {
                            return searchParentAndGetOnlyTag(chooseMethodForSearchingOnlyTag(tag)(virtualDOM))(virtualDOM)
                            });
                });
        });
};

module.exports = {
    getOneSelector
};