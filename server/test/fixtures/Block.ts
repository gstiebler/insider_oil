import utils = require('../lib/utils');

module.exports = function(db) {
    return db.models.Block.bulkCreate([
        {
            name: 'BM-BAR-1',
            basin_id: utils.idByName('Basin', 'Recôncavo'),
            name_contract: 'BM-BAR-1',
            bid: 'BID3',
            operator_id: utils.idByName('Company', 'Petrobras'),
            end_1: '2004-08-29',
            end_2: '2012-07-18',
            end_3 : '2014-04-20',
            end_last: '2016-12-31',
            status: 'SUSPENSO',
            concessionaries: '*Petrobras - 75%, ONGC Campos - 25%'
        },
        {
            name: 'ES-M-529',
            basin_id: utils.idByName('Basin', 'Potiguar'),
            name_contract: 'BM-ES-40',
            bid: 'BID9',
            operator_id: utils.idByName('Company', 'Statoil'),
            end_1: '2012-10-14',
            end_2: '2015-03-28',
            end_3 : '2019-12-31',
            end_last: '2019-12-31',
            status: 'PAD EM ANÁLISE',
            concessionaries: '*Perenco Brasil - 40%, OGX - 50%, Sinochem Petróleo - 10%'
        },
        {
            name: 'PN-T-102',
            basin_id: utils.idByName('Basin', 'Tucano Central'),
            name_contract: 'BT-PN-1',
            bid: 'BID9',
            operator_id: utils.idByName('Company', 'Schahin'),
            end_1: '2012-03-12',
            end_2: '2014-03-12',
            end_3 : null,
            end_last: '2016-06-25',
            status: '',
            concessionaries: '*Parnaíba Gás Natural - 50%, Imetame - 16.67%, Delp - 16.665%, Orteng - 16.665%'
        }
    ]);
}