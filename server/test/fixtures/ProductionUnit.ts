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
            coordinates: '{"lat":-21.23799528,"lng":-39.96288806}',
            operator_id: utils.idByName('Company', 'Petrobras'),
            owner_id: utils.idByName('Company', 'Petrobras'),
        },
        {
            name: 'Cidade de Magaratiba',
            oil_field_id: utils.idByName('OilField', 'Jiribatuba2'),
            type: 'FPSO',
            operator_id: utils.idByName('Company', 'Petrobras'),
            owner_id: utils.idByName('Company', 'Petrobras'),
        },
        {
            name: 'Cidade de São Paulo',
            oil_field_id: utils.idByName('OilField', 'Abalone'),
            type: 'FIXED',
            status: 'Em construção',
            operator_id: utils.idByName('Company', 'Petrobras'),
            owner_id: utils.idByName('Company', 'Petrobras'),
        },
        {
            name: 'Cidade de São Vicente',
            oil_field_id: utils.idByName('OilField', 'Abalone'),
            type: 'FIXED',
            operator_id: utils.idByName('Company', 'Petrobras'),
            owner_id: utils.idByName('Company', 'Petrobras'),
        },
        {
            name: 'Pioneer',
            oil_field_id: utils.idByName('OilField', 'Baleia Anã'),
            type: 'SEMI',
            status: 'Em projeto',
            operator_id: utils.idByName('Company', 'Statoil'),
            owner_id: utils.idByName('Company', 'Petrobras'),
        },
        {
            name: 'Pioneiro de Libra',
            oil_field_id: utils.idByName('OilField', 'Baleia Anã'),
            type: 'SEMI',
            operator_id: utils.idByName('Company', 'Petrobras'),
            owner_id: utils.idByName('Company', 'Eni Oil'),
        },
        {
            name: 'Petrobras 19',
            oil_field_id: utils.idByName('OilField', 'Jiribatuba2'),
            type: 'FPSO',
            operator_id: utils.idByName('Company', 'Eni Oil'),
            owner_id: utils.idByName('Company', 'Petrobras'),
        },
        {
            name: 'Petrobras 37',
            block_id: utils.idByName('Block', 'BM-BAR-1'),
            type: 'FPSO',
            status: 'Em projeto',
            operator_id: utils.idByName('Company', 'Petrobras'),
            owner_id: utils.idByName('Company', 'Petrobras'),
        },
        {
            name: 'Petrobras 52',
            block_id: utils.idByName('Block', 'BM-BAR-1'),
            type: 'FPSO',
            status: 'Em projeto',
            operator_id: utils.idByName('Company', 'Petrobras'),
            owner_id: utils.idByName('Company', 'Petrobras'),
        },
    ];
    
    return ProductionUnit.bulkCreate(newRecordsData);
}