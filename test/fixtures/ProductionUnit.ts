'use strict';
import utils = require('../lib/utils');
import Sequelize = require('sequelize');  

module.exports = function(db): Promise<any[]> {
    const ProductionUnit:Sequelize.Model<any, any> = db.models.ProductionUnit;
    const newRecordsData = [
        {
            name: 'Capixaba',
            oil_field_id: utils.idByName('OilField', 'Jiribatuba2'),
            type: 'FPSO',
        },
        {
            name: 'Cidade de Magaratiba',
            oil_field_id: utils.idByName('OilField', 'Jiribatuba2'),
            type: 'FPSO',
        },
        {
            name: 'Cidade de São Paulo',
            oil_field_id: utils.idByName('OilField', 'Abalone'),
            type: 'FIXED',
        },
        {
            name: 'Cidade de São Vicente',
            oil_field_id: utils.idByName('OilField', 'Abalone'),
            type: 'FIXED',
        },
        {
            name: 'Pioneer',
            oil_field_id: utils.idByName('OilField', 'Baleia Anã'),
            type: 'SEMI',
        },
        {
            name: 'Pioneiro de Libra',
            oil_field_id: utils.idByName('OilField', 'Baleia Anã'),
            type: 'SEMI',
        },
        {
            name: 'Petrobras 19',
            oil_field_id: utils.idByName('OilField', 'Jiribatuba2'),
            type: 'FPSO',
        },
        {
            name: 'Petrobras 37',
            oil_field_id: utils.idByName('OilField', 'Jiribatuba2'),
            type: 'FPSO',
        },
        {
            name: 'Petrobras 52',
            oil_field_id: utils.idByName('OilField', 'Jiribatuba2'),
            type: 'FPSO',
        },
    ];
    
    return ProductionUnit.bulkCreate(newRecordsData);
}