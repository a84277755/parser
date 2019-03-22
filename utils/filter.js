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
    needParseAgain = false
}) => {
    const receivedFinalSelector = initialLength === 1 || (lastLength === 1 && needParseAgain);
    if (receivedFinalSelector) return Promise.resolve({selector: oldSelector, lastLength});
    const {
        length: newLength,
        selector: newSelector,
        badTag,
        needToContinueParsing
    } = getParentSelectorInformation({virtualDOM, oldSelector, baseNode});
    if (badTag) return Promise.resolve({selector: oldSelector, lastLength});
    const currentLengthNotWorseThenLast = newLength > 1 && newLength <= initialLength && newLength <= lastLength;
    const bestResult = newLength === 1;
    if (!bestResult && !currentLengthNotWorseThenLast && needParseAgain) {
        return Promise.resolve({selector: oldSelector, lastLength: newLength});
    }

    if (bestResult) {
        return Promise.resolve({selector: newSelector, lastLength: newLength});
    }
    const uselessSelectorModificator = newLength === lastLength && !needToContinueParsing;
    return getBestParentSelector({
        initialLength,
        lastLength: newLength,
        virtualDOM,
        oldSelector: uselessSelectorModificator ? oldSelector : newSelector,
        baseNode: baseNode.parentNode,
        url,
        resultText,
        needParseAgain: needToContinueParsing
    });
};

module.exports = {
    getBestParentSelector
};