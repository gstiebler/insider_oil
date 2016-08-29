'use strict';
import Sequelize = require('sequelize');  

module.exports = function(db): Promise<any[]> {
    const Fleet:Sequelize.Model<any, any> = db.models.Fleet;
    const newRecordsData = [
        {
            name: 'Ataulfo Alves',
            year: 2000,
            country: 'Coreia do Sul',
            type: 'Aliviador',
            weight: 153000,
        },
        {
            name: 'Nordic Rio',
            year: 2004,
            country: 'Coreia do Sul',
            type: 'Aliviador',
            weight: 152000
        },
        {
            name: 'Anita Garibaldi',
            year: 2015,
            country: 'Brasil',
            type: 'Escuros/Claros',
            weight: 72786
        },
        {
            name: 'Barbosa Lima Sobrinho',
            year: 2016,
            country: 'Brasil',
            type: 'Gás',
            weight: 9000
        },
    ];
    
    return Fleet.bulkCreate(newRecordsData);
}