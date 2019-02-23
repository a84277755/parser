// Получить из строки набор атрибутов (с учетом наличия пробелов в атрибуте (класс))
const getAttributesFromFoundString = (foundAttributes) => 
    foundAttributes.replace(/>.*/,'')
        .replace(/\s{2,}/g,' ')
        .trim()
        .split(/"\s/)
        .reduce((result, attribute) => {
        if (/[><\/]/.test(attribute)) return result;
        const [key, value] = attribute.split('=');
        return {...result, [key]: value ? value.replace(/"/g, '') : true};
    }, {});

module.exports = {
    getAttributesFromFoundString
};