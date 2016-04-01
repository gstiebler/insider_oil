"use strict";
var utils = require('../lib/utils');

module.exports = function(db) {
    return db.ComercialDeclaration.bulkCreate([
        {
            block_id: utils.idByName('Block', 'BM-BAR-1'),
            oil_field_id: utils.idByName('OilField', 'Anambé'),
            basin_id: utils.idByName('Basin', 'Paraná'),
            attached: 'NÃO',
            date: '2015-12-08',
        },
        {
            block_id: utils.idByName('Block', 'ES-M-529'),
            oil_field_id: utils.idByName('OilField', 'Jiribatuba2'),
            basin_id: utils.idByName('Basin', 'São Francisco'),
            attached: 'NÃO',
            date: '2014-03-20',
        },
        {
            block_id: utils.idByName('Block', 'PN-T-102'),
            oil_field_id: utils.idByName('OilField', 'Azulão'),
            basin_id: utils.idByName('Basin', 'Solimões'),
            attached: 'NÃO',
            date: '2018-01-30',
        }
    ]);
}