import utils = require('../lib/utils');

const idOnshore = utils.idByName('DrillingRigOnshore', 'NIC-01');
const idOffshore = utils.idByName('DrillingRigOffshore', 'Aban Abraham');

module.exports = function(db) {
    return db.models.Well.bulkCreate([
        {
            name: "1A 0001 BA",
            operator_id: utils.idByName('Company', 'Petrobrás'),
            block_id: utils.idByName('Block', 'BM-BAR-1'),
            lat: -12.79429444,
            lng: -38.43638167,
            start: '2015-09-01',
            drilling_rig: idOnshore + ':onshore' 
        },
        {
            name: "1AGIP1RJS",
            operator_id: utils.idByName('Company', 'Eni Oil'),
            block_id: utils.idByName('Block', 'ES-M-529'),
            lat: -4.91808556,
            lng: -37.22464472,
            start: '2012-01-23',
            drilling_rig: idOnshore + ':onshore' 
        },
        {
            name: "1AJ 0001 BA",
            operator_id: utils.idByName('Company', 'Recôncavo E&P'),
            block_id: utils.idByName('Block', 'PN-T-102'),
            lat: -9.98799556,
            lng: -38.67655583,
            start: '2016-12-30',
            drilling_rig: idOffshore + ':offshore' 
        }
    ]);
}