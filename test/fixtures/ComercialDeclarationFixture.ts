"use strict";
import utils = require('../lib/utils');

module.exports = function(db) {
    return db.models.ComercialDeclaration.bulkCreate([
        {
            block_id: utils.idByName('Block', 'BM-BAR-1'),
            attached: 'NÃO',
            date: '2015-12-08',
        },
        {
            block_id: utils.idByName('Block', 'ES-M-529'),
            attached: 'NÃO',
            date: '2014-03-20',
        },
        {
            block_id: utils.idByName('Block', 'PN-T-102'),
            attached: 'NÃO',
            date: '2018-01-30',
        }
    ]);
}