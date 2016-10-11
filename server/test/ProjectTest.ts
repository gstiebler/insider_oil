"use strict"

import fiberTests = require('./lib/fiberTests');
import db = require('../db/models');
import * as nodeunit from 'nodeunit';
import dbServerController = require('../controllers/dbServerController');
import * as AdminController from '../controllers/AdminController';
import * as ni from '../../common/NetworkInterfaces';
import { await } from '../lib/await';
import { IFrontEndProject, IProjectJsonField } from '../../common/Interfaces';
const utils = require('./lib/utils');

const notModDBGroup: nodeunit.ITestGroup = {
    
personsOfContractedInProject: (test: nodeunit.Test) => {
    const revampId = utils.idByName('Project', 'Revamp de Mexilhão');
    const filters = {
        id: revampId,
        index: 1
    };
    const query:ni.GetQueryData.req = {
        queryName: 'personsOfContractedInProject',
        filters: filters
    }

    const reqQueryValues = { query };
    const resQueryValues:ni.GetQueryData.res = 
        utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(3, resQueryValues.records.length);
    test.equal('Felipe', resQueryValues.records[0].person_name);
    test.equal('Marcelo', resQueryValues.records[1].person_name);
    test.done(); 
},

personsOfOwnerInProject: (test: nodeunit.Test) => {
    const revampId = utils.idByName('Project', 'Revamp de Mexilhão');
    const filters = {
        id: revampId,
        index: 1
    };
    const query:ni.GetQueryData.req = {
        queryName: 'personsOfOwnerInProject',
        filters: filters
    }

    const reqQueryValues = { query };
    const resQueryValues:ni.GetQueryData.res = 
        utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(2, resQueryValues.records.length);
    test.equal('Felipe', resQueryValues.records[0].person_name);
    test.equal('Guilherme Stiebler', resQueryValues.records[1].person_name);
    test.done(); 
},

projectsTargetSales: (test: nodeunit.Test) => {
    const revampId = utils.idByName('Project', 'Revamp de Mexilhão');
    const filters = {
        fase: 'CAPEX',
        type: 'Petróleo'
    };
    const query:ni.GetQueryData.req = {
        queryName: 'projectsTargetSales',
        filters: filters
    }

    const reqQueryValues = { query };
    const resQueryValues:ni.GetQueryData.res = 
        utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(1, resQueryValues.records.length);
    test.equal('Libra', resQueryValues.records[0].p_name);
    test.equal('Ouro Preto', resQueryValues.records[0].c_name);
    test.done(); 
},

projectTypesAndStages: (test: nodeunit.Test) => {
    const filters = {
        fase: 'CAPEX',
    };
    const query:ni.GetQueryData.req = {
        queryName: 'projectTypesAndStages',
        filters: filters
    }

    const reqQueryValues = { query };
    const resQueryValues:ni.GetQueryData.res = 
        utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(3, resQueryValues.records.length);
    test.equal('Petróleo', resQueryValues.records[1].segment_type);
    test.equal('CAPEX', resQueryValues.records[1].stage);
    test.done();
},

Project: (test) => {
    const projects = await( db.models.Project.findAll() );
    const mexilhao = projects[0];
    const objs:IFrontEndProject[] = mexilhao.objects;
    test.equal('Plataforma', objs[0].description);

    const jsonField:IProjectJsonField = JSON.parse(mexilhao.json_field);
    test.equal(2, jsonField.contractors.length);
    test.equal("39", jsonField.contractors[0].contractor_id);
    test.equal(3, jsonField.contractors[0].persons_id.length);
    test.equal(1, jsonField.contractors[0].persons_id[0]);
    test.equal('contrato global', jsonField.contractors[0].scope);
    test.equal('engenharia', jsonField.contractors[1].scope);
    test.done();
},

personRelatedProjectsContractor: (test) => {
    const filters = {
        personId: '4',
    };
    const query:ni.GetQueryData.req = {
        queryName: 'personRelatedProjects',
        filters: filters
    }

    const reqQueryValues = { query };
    const resQueryValues:ni.GetQueryData.res = 
        utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(1, resQueryValues.records.length);
    test.equal('Revamp de Mexilhão', resQueryValues.records[0].p_name);
    test.done();
},

personRelatedProjectsContracteds: (test) => {
    const filters = {
        personId: '5',
    };
    const query:ni.GetQueryData.req = {
        queryName: 'personRelatedProjects',
        filters: filters
    }

    const reqQueryValues = { query };
    const resQueryValues:ni.GetQueryData.res = 
        utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(2, resQueryValues.records.length);
    test.equal('Libra', resQueryValues.records[0].p_name);
    test.equal('Áries', resQueryValues.records[1].p_name);
    test.done();
},

}

const group: nodeunit.ITestGroup = {

ProjectEdit: (test: nodeunit.Test) => {
    {
        const projects = await( db.models.Project.findAll() );
        const mexilhao = projects[0];
        const jsonField1:IProjectJsonField = {
            "contractors": [
                {
                    "scope": "contrato global", 
                    "persons_id": ["1", "2", "3"],
                    "contractor_id": "39",
                contracts_id: ["2", "3"]
                },
                {
                    "scope": "engenharia",
                    "persons_id": ["2", "3"],
                    "contractor_id": "17",
                contracts_id: ["2", "1"]
                }
            ],
            owner_persons_id: ["2", "1"]
        };
        mexilhao.json_field = jsonField1;
        await(mexilhao.save());
    }

    const projects = await( db.models.Project.findAll() );
    const mexilhao = projects[0];
    const jsonField:IProjectJsonField = JSON.parse(mexilhao.json_field);
    test.equal(2, jsonField.contractors.length);
    test.equal("39", jsonField.contractors[0].contractor_id);
    test.equal(3, jsonField.contractors[0].persons_id.length);
    test.equal(1, jsonField.contractors[0].persons_id[0]);
    test.equal('contrato global', jsonField.contractors[0].scope);
    test.equal('engenharia', jsonField.contractors[1].scope);
    test.done();
}

}

exports.notModDBGroup = fiberTests.convertTests( notModDBGroup, true );
exports.group = fiberTests.convertTests( group, false );