const {getParentSelectorInformation} = require('../utils/selectors');

const getBestParentSelector = ({
    initialLength,
    lastLength,
    virtualDOM,
    oldSelector,
    baseNode
}) => {
    if (initialLength === 1 || lastLength === 1) return oldSelector;
    const {length: newLength, selector: newSelector} = getParentSelectorInformation({virtualDOM, oldSelector, baseNode});
    const currentLengthNotWorseThenLast = newLength > 1 && newLength <= initialLength && newLength <= lastLength;
    const bestResult = newLength === 1;
    if (!bestResult && !currentLengthNotWorseThenLast) {
        return oldSelector;
    }
    if (bestResult) {
        return newSelector;
    }
    return getBestParentSelector({
        initialLength,
        lastLength: newLength,
        virtualDOM,
        oldSelector: newLength === lastLength ? newSelector : oldSelector,
        baseNode: baseNode.parentNode
    });
};

module.exports = {
    getBestParentSelector
};