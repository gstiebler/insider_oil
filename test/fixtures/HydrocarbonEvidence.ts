'use strict';
import utils = require('../lib/utils');
import Sequelize = require('sequelize');  

module.exports = function(db): Promise<any[]> {
    const HydrocarbonEvidence:Sequelize.Model<any, any> = db.models.HydrocarbonEvidence;
    const newRecordsData = [
        {
            well_id: utils.idByName('Well', '1A 0001 BA'),
            notification_date: '2016-04-13',
            fluids: 'Gás e Petróleo',
            depth: 0.0
        },
        {
            well_id: utils.idByName('Well', '1A 0001 BA'),
            notification_date: '2015-12-08',
            fluids: 'Petróleo',
            depth: 2735.5
        },
        {
            well_id: utils.idByName('Well', '1AJ 0001 BA'),
            notification_date: '2015-12-08',
            fluids: 'Não Caracterizado',
            depth: 1942
        }
    ];
    
    return HydrocarbonEvidence.bulkCreate(newRecordsData);
}