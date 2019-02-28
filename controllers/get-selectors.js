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
                                return searchParentAndGetOnlyTag(chooseMethodForSearchingOnlyTag(tag)(virtualDOM))(virtualDOM);
                                });
                    });
            });    
};

const getSelectorFromDifferentPages = (dataArray) => {
    if (dataArray && typeof dataArray === 'object' && dataArray.length > 1){
        return Promise.all(dataArray.map(getOneSelector))
            // .then(selectors => {
            //     const result = {
            //         allSelectorsSame: true
            //     };
            //     selectors.forEach(({selector, url}) => {
            //         if 
            //     })
            // });
    }
    return Promise.reject({error: 'Некорректные отправляемые данные, возможно, вы отправляете меньше 2х элементов или не в формате [{searchText:"text", url: "URL"}'});
};

module.exports = {
    getOneSelector,
    getSelectorFromDifferentPages
};