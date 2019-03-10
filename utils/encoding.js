const getClearedData = (chunk) => {
    return chunk.toString('utf8')
        .replace(/&ndash;/g,'-')
        .replace(/(&nbsp;)|(<br>)|(<br\/>)|(<br \/>)|(\s{2,})|(\\n)/g,' ');
};

module.exports = {
    getClearedData
};