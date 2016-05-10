'use strict';
import utils = require('../lib/utils');
import Sequelize = require('sequelize');  

module.exports = function(db): Promise<any[]> {
    const ProductionWell:Sequelize.Model<any, any> = db.models.ProductionWell;
    const newRecordsData = [
        {
            name: '7C 0137 BA',
            name_operator: '7C 0137 BA',
            oil_field_id: utils.idByName('OilField', 'Jiribatuba2'),
            production_unit_id: utils.idByName('ProductionUnit', 'Capixaba'),
        },
        {
            name: '7CB 0009D SES',
            name_operator: '7CB 0009D SES',
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
            name: '7MRL 0054 RJS',
            name_operator: '7MRL 0054 RJS',
            oil_field_id: utils.idByName('OilField', 'Marlim'),
            production_unit_id: utils.idByName('ProductionUnit', 'Pioneer'),
        },
        {
            name: '7MRL 0062D RJS',
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
    
    return ProductionWell.bulkCreate(newRecordsData);
}