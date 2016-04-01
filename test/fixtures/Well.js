var utils = require('../lib/utils');

const idOnshore = utils.idByName('DrillingRigOnshore', 'NIC-01');
const idOffshore = utils.idByName('DrillingRigOffshore', 'Aban Abraham');

module.exports = function(db) {
    return db.Well.bulkCreate([
        {
            name: "1A 0001 BA",
            operator_id: utils.idByName('Company', 'Petrobrás'),
            state: "BA",
            basin_id: utils.idByName('Basin', 'Potiguar'),
            block_id: utils.idByName('Block', 'BM-BAR-1'),
            lat: -12.79429444,
            lng: -38.43638167,
            drilling_rig: idOnshore + ':onshore' 
        },
        {
            name: "1AGIP1RJS",
            operator_id: utils.idByName('Company', 'Eni Oil'),
            state: "RJ",
            basin_id: utils.idByName('Basin', 'Tucano Central'),
            block_id: utils.idByName('Block', 'ES-M-529'),
            lat: -4.91808556,
            lng: -37.22464472,
            drilling_rig: idOnshore + ':onshore' 
        },
        {
            name: "1AJ 0001 BA",
            operator_id: utils.idByName('Company', 'Recôncavo E&P'),
            state: "BA",
            basin_id: utils.idByName('Basin', 'Recôncavo'),
            block_id: utils.idByName('Block', 'PN-T-102'),
            lat: -9.98799556,
            lng: -38.67655583,
            drilling_rig: idOffshore + ':offshore' 
        }
    ]);
}