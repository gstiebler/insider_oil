import utils = require('../lib/utils');

module.exports = function(db) {
    return db.models.FixedUEPProduction.bulkCreate([
        {
            name: 'Peregrino A',
            code: 'PEREGRINO A',
            basin_id: utils.idByName('Basin', 'Potiguar'),
            operator_id: utils.idByName('Company', 'Paragon'),
            lat: -23.334167,
            lng: -41.2983,
            depth: 106
        },
        {
            name: 'PEROA',
            code: 'PPER',
            basin_id: utils.idByName('Basin', 'Tucano Central'),
            operator_id: utils.idByName('Company', 'Etesco'),
            lat: -19.564167,
            lng: -39.25389,
            depth: 70
        },
        {
            name: 'PLATAFORMA BIQUARA 1',
            code: 'PBIQ-1',
            basin_id: utils.idByName('Basin', 'Recôncavo'),
            operator_id: utils.idByName('Company', 'Eni Oil'),
            lat: -4.85694,
            lng: -36.560278,
            depth: 20
        }
    ]);
}