'use strict';
import Sequelize = require('sequelize');  
import utils = require('../lib/utils');
import { await } from '../../lib/await';

module.exports = function(db) {
    const Contract:Sequelize.Model<any, any> = db.models.Contract;
    const newRecordsData = [
        {
            user_uid: '001',
            supplier: 'EXTERRAN SERVICOS DE OLEO E GAS',
            supplier_identifier: '02.805.820/0001-86',
            contract_object: 'SERVIÇOS DE CONSTRUÇÃO E MONTAGEM, SERVIÇOS DE COMPRESSÃO DE',
            start: '2011-02-14',
            end: '2019-02-11',
            value: 43707266.86,
            situation: 'Ativo',
            additives_ids: '004-003-002-001',
            bid_id: null,
            show_day_rate: false,
            segment_id: utils.idByName('IndustrySegment', 'Petróleo'),
            type: 'CAPEX',
            projects: [{
                model: 'Basin',
                id: utils.idByName('Basin', 'Amazonas'),
            }]
        },
        {
            user_uid: '300',
            supplier_obj_id: utils.idByName('Company', 'Queiroz Galvão'),
            contract_object: 'SERVIÇOS DE CONSTRUÇÃO E MONTAGEM INDUSTRIAL ELÉTRICA',
            start: '2013-07-15',
            end: '2020-07-13',
            value: 51734951.30,
            situation: 'Ativo',
            additives_ids: '801-800-004-003-002-001',
            bid_id: 2,
            show_day_rate: false,
            type: 'não',
            projects: [{
                model: 'Basin',
                id: utils.idByName('Basin', 'Amazonas'),
            }]
        },
        {
            user_uid: '99',
            supplier: 'G&E MANUTENCAO E SERVICOS LTDA',
            supplier_identifier: '01.104.740/0001-30',
            contract_object: 'SERVIÇOS DE PROJETO, CONSTRUÇÃO E MONTAGEM DO SISTEMA DE COM',
            start: '2015-07-20',
            end: '2015-08-10',
            value: 17554089.76,
            situation: 'Ativo',
            additives_ids: '001',
            bid_id: null,
            show_day_rate: true,
            type: 'OPEX',
            projects: [{
                model: 'Basin',
                id: utils.idByName('Basin', 'Alagoas'),
            }]
        },
        {
            user_uid: '42',
            supplier: 'Fonecedor',
            supplier_identifier: '01.104.740/0001-30',
            contract_object: 'SERVIÇOS DE PROJETO, CONSTRUÇÃO E MONTAGEM DO SISTEMA DE COM',
            start: '2007-07-20',
            end: '2007-08-10',
            value: 17554089.76,
            situation: 'Ativo',
            additives_ids: '001',
            bid_id: null,
            show_day_rate: true,
            type: 'OPEX',
            segment_id: utils.idByName('IndustrySegment', 'Manutenção'),
            projects: [{
                model: 'Basin',
                id: utils.idByName('Basin', 'Alagoas'),
            }]
        },
        {
            user_uid: '665',
            supplier: 'Fonecedor',
            supplier_identifier: '01.104.740/0001-30',
            contract_object: 'SERVIÇOS DE PROJETO, CONSTRUÇÃO E MONTAGEM DO SISTEMA DE COM',
            start: '2006-07-20',
            end: '2006-08-10',
            value: 17554089.76,
            situation: 'Ativo',
            additives_ids: '001',
            bid_id: null,
            show_day_rate: true,
            segment_id: utils.idByName('IndustrySegment', 'Manutenção'),
            projects: [{
                model: 'Basin',
                id: utils.idByName('Basin', 'Alagoas'),
            }]
        },
    ];
    
    for(var obj of newRecordsData) { 
        await(db.models.Contract.create(obj));
    }
}