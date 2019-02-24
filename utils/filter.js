const {getParentSelectorInformation} = require('../utils/selectors');
const {getVirtualDom} = require('../controllers/parse-tags');

const getBestParentSelector = async ({
    initialLength,
    lastLength,
    virtualDOM,
    oldSelector,
    baseNode,
    url,
    resultText,
    sameResult = false
}) => {
    const receivedFinalSelector = initialLength === 1 || (lastLength === 1 && sameResult);
    if (receivedFinalSelector) return Promise.resolve(oldSelector);
    const {length: newLength, selector: newSelector, badTag} = getParentSelectorInformation({virtualDOM, oldSelector, baseNode});
    if (badTag) return Promise.resolve(oldSelector);
    const currentLengthNotWorseThenLast = newLength > 1 && newLength <= initialLength && newLength <= lastLength;
    const bestResult = newLength === 1;
    if (!bestResult && !currentLengthNotWorseThenLast && sameResult) {
        return Promise.resolve(oldSelector);
    }
    const sameResultReceived = await checkLastAndCurrentParams({
        selector: newSelector,
        url,
        lastLength: newLength,
        resultText
    });
    
    if (sameResultReceived && bestResult) {
        return Promise.resolve(newSelector);
    }
    const uselessSelectorModificator = newLength === lastLength || !sameResultReceived;
    return getBestParentSelector({ // @TODO научиться выкидывать динамичные айдишники
        initialLength,
        lastLength: newLength,
        virtualDOM,
        oldSelector: uselessSelectorModificator ? oldSelector : newSelector,
        baseNode: baseNode.parentNode,
        url,
        resultText,
        sameResult: sameResultReceived
    });
};

const checkLastAndCurrentParams = ({selector, url, lastLength, resultText}) => {
    return getVirtualDom(url)
        .then(virtualDOM => {
            let sameData = false;
            const result = virtualDOM.document.querySelectorAll(selector);
            if (lastLength !== result.length) {
                return sameData;
            }
            [...result].forEach(data => {
                if (sameData) return;
                if (data.textContent === resultText) {
                    sameData = true;
                }
            });
            return sameData;
        });
};

module.exports = {
    getBestParentSelector
};