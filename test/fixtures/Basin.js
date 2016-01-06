module.exports = function(db) {
    return db.Basin.bulkCreate([
        {
            name: 'Recôncavo'
        },
        {
            name: 'Potiguar'
        },
        {
            name: 'Tucano Central'
        }
    ]);
}