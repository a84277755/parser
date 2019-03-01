const isCharsetWindows1251 = (contentType) => {
    return !!~contentType.toLowerCase().indexOf('windows-1251');
};

const getClearedData = (chunk) => {
    return chunk.toString('utf8')
        // .replace(/\\u[\da-f]{4}/gi, match => String.fromCharCode(parseInt(match.replace('\\u', ''), 16)))
        .replace(/&ndash;/g,'-')
        .replace(/(&nbsp;)|(<br>)|(<br\/>)|(<br \/>)|(\s{2,})|(\\n)/g,' ')
        .toLowerCase();  
};

module.exports = {
    isCharsetWindows1251,
    getClearedData
};