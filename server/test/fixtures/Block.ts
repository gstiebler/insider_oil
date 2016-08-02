import utils = require('../lib/utils');

module.exports = function(db) {
    const blockObjs = [
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
            polygons: '[[{"lat":-1.83,"lng":-42.625},{"lat":-1.83,"lng":-42.75},{"lat":-2,"lng":-42.75}]]',
            concessionaries: 
                [ { id: utils.idByName('Company', 'Eni Oil')  },
                { id: utils.idByName('Company', 'Petrobras')  } ],
            concessionaries_props: [ 33, 67 ],
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
            status: 'PAD EM ANÁLISE'
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
            status: ''
        }
    ];

    const promisesArray = [];
    for(var blockObj of blockObjs) {
        promisesArray.push(db.models.Block.create(blockObj));
    }
    
    return Promise.all(promisesArray);
}