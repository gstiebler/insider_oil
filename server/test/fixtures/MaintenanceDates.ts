'use strict';
import utils = require('../lib/utils');
import Sequelize = require('sequelize');  

module.exports = function(db): Promise<any[]> {
    const MaintenanceDate:Sequelize.Model<any, any> = db.models.MaintenanceDate;
    const newRecordsData = [
        {
            period: '2015-10-20',
            production_unit_id: utils.idByName('ProductionUnit', 'Capixaba'),
        },
        {
            period: '2010-02-20',
            production_unit_id: utils.idByName('ProductionUnit', 'Capixaba'),
        },
        {
            period: '2020-01-01',
            production_unit_id: utils.idByName('ProductionUnit', 'Pioneiro de Libra'),
        },
    ];
    
    return MaintenanceDate.bulkCreate(newRecordsData);
}