"use strict"

import fiberTests = require('./lib/fiberTests');
import db = require('../db/models');
import dbServerController = require('../controllers/dbServerController');
import nodeunit = require('nodeunit');
import * as AdminController from '../controllers/AdminController';
import { await } from '../lib/await';

const utils = require('./lib/utils');


const group: nodeunit.ITestGroup = {

getPerson: test => {
    const req = {
        query: { 
            model: 'Person',
            id: 2
        }
    };
    const response = utils.getJsonResponse.sync(null, AdminController.recordValues, req);
    test.equal('Felipe', response.values.name);
    test.equal(2, response.values.company_id);
    
    test.equal('Nome', response.fields[0].label);
    test.equal('name', response.fields[0].name);
    test.equal('E-mail', response.fields[5].label);
    test.equal('emails', response.fields[5].name);
    
    const telephones = ['+55 21 234-5678', '98989-9498'];
    test.equal(JSON.stringify(telephones), JSON.stringify(response.values.telephones));
    
    test.done();
},

createPerson: test => {
    const newItemData = {
        name: 'Michael Jackson',
        company_id: 2,
        email: 'name.example.com',
        telephones: [
            '333',
            '444',
            '555'
        ],
        projects: [
            {
                model: 'Block',
                id: utils.idByName('Block', 'ES-M-529'),
                description: 'Diretor'
            },
            {
                model: 'DrillingRigOnshore',
                id: utils.idByName('DrillingRigOnshore', 'BS-04'),
            }
        ]
    };
    const newItemReq = {
        body: { 
            model: 'Person',
            newItemData: JSON.stringify(newItemData)
        }
    };
    
    const res = utils.getJsonResponse.sync(null, AdminController.createItem, newItemReq);
    test.equal(res.msg, 'Registro criado com sucesso.');

    const reqGet = {
        query: { 
            model: 'Person',
            id: 4
        }
    };

    const responseGet = utils.getJsonResponse.sync(null, AdminController.recordValues, reqGet);
    const responseValues = responseGet.values;
    test.equal('Michael Jackson', responseValues.name);
    test.equal(JSON.stringify(newItemData.telephones), JSON.stringify(responseValues.telephones));
    // test projects
    test.equal(2, responseValues.projects.length);
    test.equal('Block', responseValues.projects[0].model);
    test.equal('ES-M-529', responseValues.projects[0].name);
    test.equal('Diretor', responseValues.projects[0].description);
      
    test.equal('DrillingRigOnshore', responseValues.projects[1].model);
    test.equal('BS-04', responseValues.projects[1].name);  
    test.ok(!responseValues.projects[1].description);  
    
    test.done();
},

editPerson: test => {
    const recordReq = {
        id: 2,
        name: 'Michael Jackson',
        company_id: utils.idByName('Company', 'Eni Oil'),
        emails: '[name.example.com]',
        telephones: [
            '333',
            '444',
            '555'
        ],
        projects: [
            {
                model: 'Block',
                id: utils.idByName('Block', 'ES-M-529'),
            },
            {
                model: 'DrillingRigOnshore',
                id: utils.idByName('DrillingRigOnshore', 'BS-04'),
            }
        ]
    };
    const reqSave = {
        body: { 
            model: 'Person',
            record: JSON.stringify(recordReq)
        }
    };
        
    const response = utils.getJsonResponse.sync(null, AdminController.saveItem, reqSave);
    test.equal('Registro salvo com sucesso.', response.msg);
    
    const reqGet = {
        query: { 
            model: 'Person',
            id: 2
        }
    };
    const responseGet = utils.getJsonResponse.sync(null, AdminController.recordValues, reqGet);
    test.equal('Michael Jackson', responseGet.values.name);
    test.equal(2, responseGet.values.company_id);
    test.equal('[name.example.com]', responseGet.values.emails);
    // TODO test that no other telephone have been deleted
    test.equal(JSON.stringify([ '333', '444', '555' ]), JSON.stringify(responseGet.values.telephones));
    
    // test projects
    test.equal(2, responseGet.values.projects.length);
    test.equal('Block', responseGet.values.projects[0].model); 
    test.equal('ES-M-529',responseGet.values.projects[0].name);    
    test.equal('DrillingRigOnshore', responseGet.values.projects[1].model);
    test.equal('BS-04', responseGet.values.projects[1].name);
      
    test.done();
},

removeProjects: test => {
    const qryOpts = { where: {name: 'Guilherme Stiebler'} };
    const guilherme = await( db.models.Person.findOne(qryOpts) );
    test.equal(1, guilherme.projects.length);
    guilherme.projects = null;
    guilherme.save();

    const guilherme2 = await( db.models.Person.findOne(qryOpts) );
    test.ok(!guilherme2.projects);

    test.done();
},
// TODO
/*deletePerson: test => {
    
}*/


};


exports.group = fiberTests.convertTests( group, false );