"use strict";
const fiberTests = require('./lib/fiberTests');
const utils = require('./lib/utils');
var db = require('../db/models');
var dbServerController = require('../controllers/dbServerController');
var await = require('../lib/await');


var group = {

getPerson: test => {
    const req = {
        query: { 
            model: 'Person',
            id: 2
        }
    };
    const response = utils.getJsonResponse.sync(null, dbServerController.recordValues, req);
    test.equal('Felipe', response.values.name);
    test.equal(2, response.values.company_id);
    
    test.equal('Nome', response.fields[0].label);
    test.equal('name', response.fields[0].name);
    test.equal('E-mail', response.fields[2].label);
    test.equal('email', response.fields[2].name);
    
    const telephones = ['+55 21 234-5678', '98989-9498'];
    test.equal(JSON.stringify(telephones), JSON.stringify(response.values.telephones));
    
    test.done();
},


createPerson: function(test) {
    const newItemReq = {
        body: { 
            model: 'Person',
            newItemData: {
                name: 'Michael Jackson',
                company_id: 2,
                email: 'name.example.com',
                telephones: [
                    '333',
                    '444',
                    '555'
                ]
            }
        }
    };
    
    const res = utils.getJsonResponse.sync(null, dbServerController.createItem, newItemReq);
    test.equal(res.msg, 'Registro criado com sucesso.');
    const checkCreatedPersonReq = {
        query: { table: 'Person' }
    };
    const response = utils.getJsonResponse.sync(null, dbServerController.main, checkCreatedPersonReq);
    test.equal(4, response.records.length);
    test.equal('Michael Jackson', response.records[3].name);
    test.equal(JSON.stringify(newItemReq.body.newItemData.telephones), JSON.stringify(response.records[3].telephones));
    test.done();
},


editPerson: function(test) {
    const reqSave = {
        body: { 
            model: 'Person',
            record: {
                id: 2,
                name: 'Michael Jackson',
                company_id: 2,
                email: 'name.example.com',
                telephones: [
                    '333',
                    '444',
                    '555'
                ]
            }
        }
    };
        
    const response = utils.getJsonResponse.sync(null, dbServerController.saveItem, reqSave);
    test.equal('Registro salvo com sucesso.', response.msg);
    
    const reqGet = {
        query: { 
            model: 'Person',
            id: 2
        }
    };
    const responseGet = utils.getJsonResponse.sync(null, dbServerController.recordValues, reqGet);
    test.equal('Michael Jackson', responseGet.values.name);
    test.equal(2, responseGet.values.company_id);
    test.equal('name.example.com', responseGet.values.email);
    test.equal(JSON.stringify([ '333', '444', '555' ]), JSON.stringify(responseGet.values.telephones));
    test.done();
},



};


fiberTests.convertTests( exports, group );