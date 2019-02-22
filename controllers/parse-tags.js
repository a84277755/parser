const {JSDOM} = require("jsdom");

const createVirtualDOM = (HTMLCode) => {
    try {
        const virtualDOM = (new JSDOM(HTMLCode)).window;
        return Promise.resolve(virtualDOM);
    } catch ( error ) {
        return Promise.reject("Ошибка создания виртуального DOM: " + error);
    }
};

const findClosestTag = searchText => HTMLCode => {
    const regExp = new RegExp(`<([\\d\\w]{1,10}).{0,100}>.{0,10}${searchText}.{0,10}<\/.{1,10}>`);
    const result = HTMLCode.match(regExp);
    return result ? result[1] : null;
};

module.exports = {createVirtualDOM, findClosestTag};