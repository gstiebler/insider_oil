'use strict';
import Sequelize = require('sequelize');  
import utils = require('../lib/utils');

module.exports = function(db): Promise<any[]> {
    const GasMovement:Sequelize.Model<any, any> = db.models.GasMovement;
    const newRecordsData = [
        {
            product: 'Gas Liquefeito',
            period_year: 2014,
            period_month: 3,
            value: 9207,
            gas_pipeline_id: utils.idByName('GasPipeline', 'GASODUTO LOR/UPN'),
        },
        {
            product: 'Gas Liquefeito',
            period_year: 2014,
            period_month: 4,
            value: 13121,
            gas_pipeline_id: utils.idByName('GasPipeline', 'GASODUTO LOR/UPN'),
        },
        {
            product: 'Gas Liquefeito',
            period_year: 2014,
            period_month: 5,
            value: 12952,
            gas_pipeline_id: utils.idByName('GasPipeline', 'GASODUTO LOR/UPN'),
        },
        {
            product: 'Gas Liquefeito',
            period_year: 2002,
            period_month: 3,
            value: 8207,
            gas_pipeline_id: utils.idByName('GasPipeline', '14-DNP-MI03/POLO-091'),
        },
        {
            product: 'Gas Liquefeito',
            period_year: 2002,
            period_month: 4,
            value: 12121,
            gas_pipeline_id: utils.idByName('GasPipeline', '14-DNP-MI03/POLO-091'),
        },
        {
            product: 'Gasolina',
            period_year: 2010,
            period_month: 5,
            value: 11952,
            gas_pipeline_id: utils.idByName('GasPipeline', '14-DNP-MI03/POLO-091'),
        },
    ];
    
    const promisesArray = [];
    for(var gasMovementObj of newRecordsData) {
        promisesArray.push(GasMovement.create(gasMovementObj));
    }
    
    return Promise.all(promisesArray);
}