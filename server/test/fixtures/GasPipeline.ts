'use strict';
import Sequelize = require('sequelize');  
import utils = require('../lib/utils');

module.exports = function(db): Promise<any[]> {
    const GasPipeline:Sequelize.Model<any, any> = db.models.GasPipeline;
    const newRecordsData = [
        {
            name: '14-DNP-MI03/POLO-091',
            state: 'AM',
            diameter: 14,
            extension: 33.46,
            classification: 'Escoamento da Produção',
            src_instalation_text: 'Plataforma de Produção de Arabaiana 1',
            src_concession_text: 'Campo de Produção de Arabaiana',
            dst_instalation_text: 'Plataforma de Produção de Pescada 1 A',
            dst_concession_text: 'Campo de Produção de Pescada',
        },
        {
            name: 'GASODUTO LOR/UPN',
            state: 'RN',
            diameter: 10,
            extension: 27,
            classification: 'Escoamento da Produção',
            src_instalation_text: 'Plataforma de Produção de Ubarana 2',
            src_concession_text: 'Campo de Produção de Ubarana',
            dst_instalation: [{
                model_name: 'ProductionUnit',
                id: utils.idByName('ProductionUnit', 'Capixaba'),
            }],
            dst_concession: [{
                model_name: 'OilField',
                id: utils.idByName('OilField', 'Jiribatuba2'),
            }],
        },
        {
            name: 'GAS. 10" EST. ARATU - FAFEN',
            state: 'BA',
            diameter: 10,
            extension: 16.765,
            classification: 'Transferência',
            src_instalation: [{
                model_name: 'Terminal',
                id: utils.idByName('Terminal', 'Barueri'),
            }],
            src_concession: [{
                model_name: 'OilField',
                id: utils.idByName('OilField', 'Congro'),
            }],
            dst_instalation: [{
                model_name: 'ProductionUnit',
                id: utils.idByName('ProductionUnit', 'Capixaba'),
            }],
            dst_concession: [{
                model_name: 'OilField',
                id: utils.idByName('OilField', 'Jiribatuba2'),
            }],
        },
    ];
    
    const promisesArray = [];
    for(var gasPipelineObj of newRecordsData) {
        promisesArray.push(GasPipeline.create(gasPipelineObj));
    }
    
    return Promise.all(promisesArray);
}