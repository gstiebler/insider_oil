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
            coordinates: '{"lat":-21.23799528,"lng":-39.96288806}'
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
            status: 'Em construção'
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
            status: 'Em projeto'
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
            block_id: utils.idByName('Block', 'BM-BAR-1'),
            type: 'FPSO',
            status: 'Em projeto'
        },
        {
            name: 'Petrobras 52',
            block_id: utils.idByName('Block', 'BM-BAR-1'),
            type: 'FPSO',
            status: 'Em projeto'
        },
    ];
    
    return ProductionUnit.bulkCreate(newRecordsData);
}