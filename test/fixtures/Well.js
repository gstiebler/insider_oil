var utils = require('../lib/utils');

module.exports = function(db) {
    return db.Well.bulkCreate([
        {
            name: "1A 0001 BA",
            operator_id: utils.idByName('Company', 'Petrobrás'),
            state: "BA",
            bacia: "Recôncavo",
            lat: -12.79429444,
            lng: -38.43638167
        },
        {
            name: "1AGIP1RJS",
            operator_id: utils.idByName('Company', 'Eni Oil'),
            state: "RJ",
            bacia: "Santos",
            lat: -4.91808556,
            lng: -37.22464472
        },
        {
            name: "1AJ 0001 BA",
            operator_id: utils.idByName('Company', 'Recôncavo E&P'),
            state: "BA",
            bacia: "Recôncavo",
            lat: -9.98799556,
            lng: -38.67655583
        }
    ]);
}