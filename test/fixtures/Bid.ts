'use strict';
import Sequelize = require('sequelize');  
import utils = require('../lib/utils');

module.exports = function(db): Promise<any[]> {
    const Bid:Sequelize.Model<any, any> = db.models.Bid;
    const newRecordsData = [
        {
            process_number: '1792051158',
            modality: 'Convite',
            contract_object: 'LOCAÇÃO DE MODULOS HABITAVEIS',
            qty_items: 1,
            opening_moment: '2016-04-08 14:00',
            opening_local: 'Processo Eletrônico',
            opening_city: null,
            opening_state: null,
            situation: 'Homologada',
            object: [{
                model_id: utils.idByName('ModelsList', 'Basin'),
                id: utils.idByName('Basin', 'Amazonas'),
            }]
        },
        {
            process_number: '1946782168',
            modality: 'Convite',
            contract_object: 'RESINAS',
            qty_items: 3,
            opening_moment: '2016-04-19 14:00',
            opening_local: 'Processo Eletrônico',
            opening_city: null,
            opening_state: null,
            situation: 'Aberta',
            object: [{
                model_id: utils.idByName('ModelsList', 'Block'),
                id: utils.idByName('Block', 'BM-BAR-1'),
            }]
        },
        {
            process_number: '1960794160',
            modality: 'Concorrência',
            contract_object: 'CONFECÇÃO DE ETIQUETAS DE ADVERTÊNCIA (AMARELAS E AZUIS)',
            qty_items: 1,
            opening_moment: '2016-04-20 10:00',
            opening_local: 'CAUCAIA',
            opening_city: 'CAUCAIA',
            opening_state: 'CE',
            situation: 'Homologada',
            object: [
                {}
            ]
        },
    ];
    
    const promisesArray = [];
    for(var bidObj of newRecordsData) {
        promisesArray.push(Bid.create(bidObj));
    }
    
    return Promise.all(promisesArray);
}