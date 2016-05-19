'use strict';
import Sequelize = require('sequelize');  
import utils = require('../lib/utils');

module.exports = function(db): Promise<any[]> {
    const OilPipeline:Sequelize.Model<any, any> = db.models.OilPipeline;
    const newRecordsData = [
        {
            name: 'ORSUB',
            diameter: 8,
            extension: 75,
            src_state: 'BA',
            src_location_text: 'Ipiaú',
            dst_state: 'BA',
            dst_location_text: 'TT Jequié',
            products: 'Claros',
            owner_preference: 71393,
            start_date: '2013-06-30',
            max_capacity: 106855,
            op_capacity: 97283,
            contract_capacity: 97283,
            contract_released_capacity: 25890,
            contract_start_date: '2013-06-30',
        },
        {
            name: 'OPASC',
            diameter: 10,
            extension: 200,
            src_state: 'PR',
            src_location_text: 'REPAR',
            dst_state: 'SC',
            dst_location_text: 'TT Itajaí',
            products: 'Claros',
            owner_preference: 162180,
            start_date: '2012-01-15',
            max_capacity: 173196,
            op_capacity: 173196,
            contract_capacity: 97283,
            contract_released_capacity: 11016,
            contract_start_date: '2013-06-30',
        },
        {
            name: 'OSPLAN',
            diameter: 18,
            extension: 153,
            src_state: 'SP',
            src_location_text: 'REPLAN',
            dst_state: 'SP',
            dst_location_text: 'TT Guararema',
            products: 'Claros',
            owner_preference: 361692,
            start_date: '2013-06-30',
            max_capacity: 361692,
            op_capacity: 361692,
            contract_capacity: 361692,
            contract_released_capacity: 0,
            contract_start_date: '2013-06-30',
        },
    ];
    
    const promisesArray = [];
    for(var oilPipelineObj of newRecordsData) {
        promisesArray.push(OilPipeline.create(oilPipelineObj));
    }
    
    return Promise.all(promisesArray);
}