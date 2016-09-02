import utils = require('../lib/utils');
import { await } from '../../lib/await';

const idOnshore = utils.idByName('DrillingRigOnshore', 'NIC-01');
const idOffshore = utils.idByName('DrillingRigOffshore', 'Aban Abraham');

module.exports = function(db) {
    const parameters = [
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
            block_id: utils.idByName('Block', 'BM-BAR-1'),
            lat: -9.98799556,
            lng: -38.67655583,
            start: '2016-12-30',
            drilling_rig: idOffshore + ':offshore' 
        },
        {
            name: '7C 0137 BA',
            name_operator: '7C 0137 BA',
            operator_id: utils.idByName('Company', 'Petrobrás'),
            oil_field_id: utils.idByName('OilField', 'Jiribatuba2'),
            production_unit_id: utils.idByName('ProductionUnit', 'Capixaba'),
        },
        {
            name: '7CB 0009D SES',
            name_operator: '7CB 0009D SES',
            operator_id: utils.idByName('Company', 'Petrobrás'),
            oil_field_id: utils.idByName('OilField', 'Jiribatuba2'),
            production_unit_id: utils.idByName('ProductionUnit', 'Capixaba'),
        },
        {
            name: '7UB 0007D RNS',
            name_operator: '7UB 0007D RNS',
            oil_field_id: utils.idByName('OilField', 'Jiribatuba2'),
            production_unit_id: utils.idByName('ProductionUnit', 'Capixaba'),
        },
        {
            name: '7GA 0007D SES',
            name_operator: '7GA 0007D SES',
            oil_field_id: utils.idByName('OilField', 'Baleia Anã'),
            production_unit_id: utils.idByName('ProductionUnit', 'Pioneer'),
        },
        {
            name: '7MRL-0054-RJS',
            name_operator: '7MRL 0054 RJS',
            oil_field_id: utils.idByName('OilField', 'Marlim'),
            operator_id: utils.idByName('Company', 'Recôncavo E&P'),
            production_unit_id: utils.idByName('ProductionUnit', 'Pioneer'),
        },
        {
            name: '7MRL-0062D-RJS',
            name_operator: '7MRL 0062D RJS',
            oil_field_id: utils.idByName('OilField', 'Marlim'),
            production_unit_id: utils.idByName('ProductionUnit', 'Pioneer'),
        },
        {
            name: '7AB 0047D RJS',
            name_operator: '7AB 0047D RJS',
            oil_field_id: utils.idByName('OilField', 'Albacora'),
            production_unit_id: utils.idByName('ProductionUnit', 'Pioneer'),
        },
    ];

    for(var obj of parameters) { 
        await(db.models.Well.create(obj));
    }
}