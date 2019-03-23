const symbolsToEscape = ['?', '.', '!', ',', ')', '(', '-', '=', '+', '*', '_', '/', '\\'];
const getSafetyText = (text) => text.split('').map(char => symbolsToEscape.includes(char) ? `\\${char}` : char).join('');

const tagsToBreakParsing = ['HTML', 'BODY', 'HEAD'];
const tagsToContinueParsing = ['TD', 'TR', 'LI', 'UL', 'TABLE', 'THEAD', 'TBODY'];

const attributesToSkip = ['href', 'content']; 

module.exports = {symbolsToEscape, getSafetyText, tagsToBreakParsing, tagsToContinueParsing, attributesToSkip};