const symbolsToEscape = ['?', '.', '!', ',', ')', '(', '-', '=', '+', '*', '_'];
const getSafetyText = (text) => text.split('').map(char => symbolsToEscape.includes(char) ? `\\${char}` : char).join('');

module.exports = {symbolsToEscape, getSafetyText};