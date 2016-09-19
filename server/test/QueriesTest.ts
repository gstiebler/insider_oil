"use strict"

import fiberTests = require('./lib/fiberTests');
var utils = require('./lib/utils');
import * as nodeunit from 'nodeunit';
import dbServerController = require('../controllers/dbServerController');
import * as AdminController from '../controllers/AdminController';


var group: nodeunit.ITestGroup = {
    
newsFromObject:  (test: nodeunit.Test) => {
    const abaloneId = utils.idByName('OilField', 'Abalone');
    const filters = {
        modelName: 'OilField',
        id: abaloneId
    };
    const reqQueryValues = {
        query: { 
            queryName: 'NewsByObject',
            filters: filters
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(1, resQueryValues.records.length);    
    test.equal('Petrobrás compra Statoil', resQueryValues.records[0].title);
    test.equal('News', resQueryValues.records[0].model);
  
    // adding more news from this oil field
    const newNews = {
        title: 'adicionando notícia',
        content: '<p>outra notícia: <a href="/app/view_record?source=OilField&amp;id=' + abaloneId + '" style="background-color: rgb(255, 255, 255);">Abalone</a> ',
        author_id: 1
    };
    const reqNewNews = {
        body: { 
            model: 'News',
            newItemData: JSON.stringify(newNews)
        }
    };
    utils.getJsonResponse.sync(null, AdminController.createItem, reqNewNews);

	// should have 2 news from this oil field now
    const moreNewsFromObject = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(2, moreNewsFromObject.records.length);

    // testing with an invalid id
    filters.id = 5450;
    reqQueryValues.query.filters = filters;
    const newsResultsWrongId = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(0, newsResultsWrongId.records.length);

    test.done();
},

}

var notModDBGroup: nodeunit.ITestGroup = {

getPersonsByProject:  (test: nodeunit.Test) => {
    const amazonasId = utils.idByName('Basin', 'Amazonas') ;
    const filters = {
        project_id: amazonasId,
        dataSource: 'Basin'
    };
    const reqQueryValues = {
        query: { 
            queryName: 'PersonsByProject',
            filters: filters
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(1, resQueryValues.records.length);
    const record = resQueryValues.records[0];
    test.equal('Guilherme Stiebler', record.p_name);
    test.equal('diretor', record.description);
    test.equal('Person', record.p_model);
    
    test.equal('Nome', resQueryValues.fields[0].label);
    test.equal('p_model', resQueryValues.fields[0].ref.modelField);
    test.equal('p_id', resQueryValues.fields[0].ref.idField);
    test.equal('p_name', resQueryValues.fields[0].ref.valueField);
    
    test.equal('Cargo', resQueryValues.fields[2].label);
    test.equal('position', resQueryValues.fields[2].fieldName);
    test.equal('VARCHAR', resQueryValues.fields[2].type);

    test.done();
},


getAmbientalLicensesByBlock:  (test: nodeunit.Test) => {
    const bmbarId = utils.idByName('Block', 'BM-BAR-1') ;
    const filters = {
        id: bmbarId,
    };
    const reqQueryValues = {
        query: { 
            queryName: 'ambientalLicenseByBlock',
            filters: filters
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(2, resQueryValues.records.length);
    
    const record = resQueryValues.records[0];
    test.equal('ABio 560/2014', record.license);
    test.equal('BP ENERGY DO BRASIL LTDA', record.entrepreneur);
    test.equal('AmbientalLicense', record.model);
    
    test.equal('Nro da licença', resQueryValues.fields[0].label);
    test.equal('model', resQueryValues.fields[0].ref.modelField);
    test.equal('id', resQueryValues.fields[0].ref.idField);
    test.equal('license', resQueryValues.fields[0].ref.valueField);
    
    test.equal('Emissão', resQueryValues.fields[1].label);
    test.equal('start', resQueryValues.fields[1].fieldName);
    test.equal('DATE', resQueryValues.fields[1].type);

    test.done();
},


getComercialDeclarationsByBlock:  (test: nodeunit.Test) => {
    const bmbarId = utils.idByName('Block', 'BM-BAR-1') ;
    const filters = {
        id: bmbarId,
    };
    const reqQueryValues = {
        query: { 
            queryName: 'comercialDeclarationsByBlock',
            filters: filters
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(1, resQueryValues.records.length);
    
    const record = resQueryValues.records[0];
    test.equal('NÃO', record.attached);
    
    test.equal('Anexado', resQueryValues.fields[0].label);
    test.equal('model', resQueryValues.fields[0].ref.modelField);
    test.equal('id', resQueryValues.fields[0].ref.idField);
    test.equal('attached', resQueryValues.fields[0].ref.valueField);
    
    test.equal('Data', resQueryValues.fields[1].label);
    test.equal('date', resQueryValues.fields[1].fieldName);
    test.equal('DATE', resQueryValues.fields[1].type);

    test.done();
},


getWellsByBlock:  (test: nodeunit.Test) => {
    const bmbarId = utils.idByName('Block', 'BM-BAR-1') ;
    const nicId = utils.idByName('DrillingRigOnshore', 'NIC-01');
    const abanId = utils.idByName('DrillingRigOffshore', 'Aban Abraham');
    const filters = {
        id: bmbarId,
    };
    const reqQueryValues = {
        query: { 
            queryName: 'wellsByBlock',
            filters: filters
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(2, resQueryValues.records.length);
    
    const recordOnshore = resQueryValues.records[0];
    test.equal('1A 0001 BA', recordOnshore.well_name);
    test.equal('Well', recordOnshore.model);
    test.equal('DrillingRigOnshore', recordOnshore.dr_model);
    test.equal(nicId, recordOnshore.dr_id);
    test.equal('NIC-01', recordOnshore.dr_name);
    
    const recordOffshore = resQueryValues.records[1];
    test.equal('1AJ 0001 BA', recordOffshore.well_name);
    test.equal('Well', recordOffshore.model);
    test.equal('DrillingRigOffshore', recordOffshore.dr_model);
    test.equal(abanId, recordOffshore.dr_id);
    test.equal('Aban Abraham', recordOffshore.dr_name);
    
    test.equal('Nome', resQueryValues.fields[0].label);
    test.equal('model', resQueryValues.fields[0].ref.modelField);
    test.equal('w_id', resQueryValues.fields[0].ref.idField);
    test.equal('well_name', resQueryValues.fields[0].ref.valueField);
    
    test.equal('Início', resQueryValues.fields[1].label);
    test.equal('start', resQueryValues.fields[1].fieldName);
    test.equal('DATE', resQueryValues.fields[1].type);
    
    test.equal('Sonda', resQueryValues.fields[2].label);
    test.equal('dr_model', resQueryValues.fields[2].ref.modelField);
    test.equal('dr_id', resQueryValues.fields[2].ref.idField);
    test.equal('dr_name', resQueryValues.fields[2].ref.valueField);

    test.done();
},

getSeismicsByBlock:  (test: nodeunit.Test) => {
    const bmbarId = utils.idByName('Block', 'BM-BAR-1') ;
    const filters = {
        id: bmbarId,
    };
    const reqQueryValues = {
        query: { 
            queryName: 'seismicsByBlock',
            filters: filters
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(2, resQueryValues.records.length);
    
    const record = resQueryValues.records[0];
    test.equal('48610.000189/2013-10', record.process);
    test.equal('PGS Investigação Petrolífera Ltda.', record.authorized_company);
    test.equal('Reprocessamento de Dados Sísmicas 3D', record.authorized_technologies);
    
    test.equal('Processo', resQueryValues.fields[0].label);
    test.equal('model', resQueryValues.fields[0].ref.modelField);
    test.equal('id', resQueryValues.fields[0].ref.idField);
    test.equal('process', resQueryValues.fields[0].ref.valueField);
    
    test.equal('Publicação no DOU', resQueryValues.fields[2].label);
    test.equal('dou_publi_date', resQueryValues.fields[2].fieldName);
    test.equal('DATE', resQueryValues.fields[2].type);

    test.done();
},

getHydrocarbonEvidencesByBlock:  (test: nodeunit.Test) => {
    const bmbarId = utils.idByName('Block', 'BM-BAR-1') ;
    const filters = {
        id: bmbarId,
    };
    const reqQueryValues = {
        query: { 
            queryName: 'hydrocarbonEvidencesByBlock',
            filters: filters
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(3, resQueryValues.records.length);
    
    const record = resQueryValues.records[0];
    test.equal('1A 0001 BA', record.well_name);
    test.equal('Petróleo', record.fluids);

    test.done();
},

getPersonsByCompany:  (test: nodeunit.Test) => {
    const petroId = utils.idByName('Company', 'Petrobras') ;
    const filters = {
        id: petroId,
    };
    const reqQueryValues = {
        query: { 
            queryName: 'personsByCompany',
            filters: filters
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(1, resQueryValues.records.length);

    test.done();
},

getBidsByObject: (test: nodeunit.Test) => {
    const amazonasId = utils.idByName('Basin', 'Amazonas') ;
    const filters = {
        obj_id: amazonasId,
        dataSource: 'Basin'
    };
    const reqQueryValues = {
        query: { 
            queryName: 'BidsByObject',
            filters: filters
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(1, resQueryValues.records.length);

    test.done();
},

contractsByObject: (test: nodeunit.Test) => {
    const amazonasId = utils.idByName('Basin', 'Amazonas') ;
    const filters = {
        obj_id: amazonasId,
        dataSource: 'Basin'
    };
    const reqQueryValues = {
        query: { 
            queryName: 'contractsByObject',
            filters: filters,
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(2, resQueryValues.records.length, 'size');
    {
        const record = resQueryValues.records[0];
        test.equal('Queiroz Galvão', record.supplier, 'supplier');
        test.equal('SERVIÇOS DE CONSTRUÇÃO E MONTAGEM INDUSTRIAL ELÉTRICA', record.c_contract_object, 'object');   
    }    
    {
        const record = resQueryValues.records[1];
        test.equal('EXTERRAN SERVICOS DE OLEO E GAS', record.supplier, 'supplier');
        test.equal('SERVIÇOS DE CONSTRUÇÃO E MONTAGEM, SERVIÇOS DE COMPRESSÃO DE', record.c_contract_object, 'object');   
    }

    test.done();
},

contractsBySupplier: (test: nodeunit.Test) => {
    const qgId = utils.idByName('Company', 'Queiroz Galvão') ;
    const filters = {
        id: qgId
    };
    const reqQueryValues = {
        query: { 
            queryName: 'contractsBySupplier',
            filters: filters,
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(1, resQueryValues.records.length);
    test.equal('SERVIÇOS DE CONSTRUÇÃO E MONTAGEM INDUSTRIAL ELÉTRICA', resQueryValues.records[0].c_contract_object);

    test.done();
},

hydrocarbonEvidencesByOilField: (test: nodeunit.Test) => {
    const jiritubaId = utils.idByName('OilField', 'Jiribatuba2') ;
    const filters = {
        id: jiritubaId,
        dataSource: 'Basin'
    };
    const reqQueryValues = {
        query: { 
            queryName: 'hydrocarbonEvidencesByOilField',
            filters: filters
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(3, resQueryValues.records.length);

    test.done();
},

maintenanceDatesByProductionUnit: (test: nodeunit.Test) => {
    const capixabaId = utils.idByName('ProductionUnit', 'Capixaba') ;
    const filters = {
        id: capixabaId,
    };
    const reqQueryValues = {
        query: { 
            queryName: 'maintenanceDatesByProductionUnit',
            filters: filters
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(2, resQueryValues.records.length);
    test.equal('10/2015', resQueryValues.records[0].formatted_period);
    test.equal('02/2010', resQueryValues.records[1].formatted_period);

    test.done();
},

productionUnitByOilField: (test: nodeunit.Test) => {
    const jiritubaId = utils.idByName('OilField', 'Jiribatuba2') ;
    const filters = {
        id: jiritubaId,
    };
    const reqQueryValues = {
        query: { 
            queryName: 'productionUnitByOilField',
            filters: filters
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(3, resQueryValues.records.length);
    test.equal('Capixaba', resQueryValues.records[0].pu_name);
    test.equal('Cidade de Magaratiba', resQueryValues.records[1].pu_name);

    test.done();
},

productionUnitByBlock: (test: nodeunit.Test) => {
    const barId = utils.idByName('Block', 'BM-BAR-1') ;
    const filters = {
        id: barId,
    };
    const reqQueryValues = {
        query: { 
            queryName: 'productionUnitByBlock',
            filters: filters
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(2, resQueryValues.records.length);

    test.done();
},

wellsByDrillingRigOffshore: (test: nodeunit.Test) => {
    const abanId = utils.idByName('DrillingRigOffshore', 'Aban Abraham');
    const filters = {
        id: abanId,
    };
    const reqQueryValues = {
        query: { 
            queryName: 'wellsByDrillingRigOffshore',
            filters: filters
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(1, resQueryValues.records.length);

    test.done(); 
},

wellsByDrillingRigOnshore: (test: nodeunit.Test) => {
    const nicId = utils.idByName('DrillingRigOnshore', 'NIC-01');
    const filters = {
        id: nicId,
    };
    const reqQueryValues = {
        query: { 
            queryName: 'wellsByDrillingRigOnshore',
            filters: filters
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(2, resQueryValues.records.length);

    test.done(); 
},

blocksOperatedByCompany: (test: nodeunit.Test) => {
    const petroId = utils.idByName('Company', 'Petrobras');
    const filters = {
        id: petroId,
    };
    const reqQueryValues = {
        query: { 
            queryName: 'blocksOperatedByCompany',
            filters: filters
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(1, resQueryValues.records.length);

    test.done(); 
},

oilFieldsOperatedByCompany: (test: nodeunit.Test) => {
    const petroId = utils.idByName('Company', 'Petrobras');
    const filters = {
        id: petroId,
    };
    const reqQueryValues = {
        query: { 
            queryName: 'oilFieldsOperatedByCompany',
            filters: filters
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(2, resQueryValues.records.length);
    test.equal('Produção', resQueryValues.records[0].formatted_stage);

    test.done(); 
},

blocksConcessionaryByCompany: (test: nodeunit.Test) => {
    const petroId = utils.idByName('Company', 'Petrobras');
    const filters = {
        id: petroId,
    };
    const reqQueryValues = {
        query: { 
            queryName: 'blocksConcessionaryByCompany',
            filters: filters
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(1, resQueryValues.records.length);

    test.done(); 
},

oilFieldConcessionaryByCompany: (test: nodeunit.Test) => {
    const petroId = utils.idByName('Company', 'Petrobras');
    const filters = {
        id: petroId,
    };
    const reqQueryValues = {
        query: { 
            queryName: 'oilFieldConcessionaryByCompany',
            filters: filters
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(1, resQueryValues.records.length);
    test.equal('Produção', resQueryValues.records[0].formatted_stage);

    test.done(); 
},

drillingRigsByContractor: (test: nodeunit.Test) => {
    const petroId = utils.idByName('Company', 'Petrobras');
    const filters = {
        id: petroId,
    };
    const reqQueryValues = {
        query: { 
            queryName: 'drillingRigsByContractor',
            filters: filters
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(4, resQueryValues.records.length);

    test.done(); 
},

drillingRigsByOperator: (test: nodeunit.Test) => {
    const petroId = utils.idByName('Company', 'Petrobras');
    const filters = {
        id: petroId,
    };
    const reqQueryValues = {
        query: { 
            queryName: 'drillingRigsByOperator',
            filters: filters
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(4, resQueryValues.records.length);

    test.done(); 
},

productionUnitsByOperator: (test: nodeunit.Test) => {
    const petroId = utils.idByName('Company', 'Petrobras');
    const filters = {
        id: petroId,
    };
    const reqQueryValues = {
        query: { 
            queryName: 'productionUnitsByOperator',
            filters: filters
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(6, resQueryValues.records.length);

    test.done(); 
},

productionUnitsByOwner: (test: nodeunit.Test) => {
    const petroId = utils.idByName('Company', 'Petrobras');
    const filters = {
        id: petroId,
    };
    const reqQueryValues = {
        query: { 
            queryName: 'productionUnitsByOwner',
            filters: filters
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(8, resQueryValues.records.length);

    test.done(); 
},

personsFromProjectContracted1: (test: nodeunit.Test) => {
    const revampId = utils.idByName('Project', 'Revamp de Mexilhão');
    const filters = {
        id: revampId,
    };
    const reqQueryValues = {
        query: { 
            queryName: 'personsFromProjectContracted1',
            filters: filters
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(3, resQueryValues.records.length);

    test.done(); 
},

projectsOfObject: (test: nodeunit.Test) => {
    const pioneerId = utils.idByName('ProductionUnit', 'Pioneer');
    const filters = {
        id: pioneerId,
        model: 'ProductionUnit'
    };
    const reqQueryValues = {
        query: { 
            queryName: 'projectsOfObject',
            filters: filters
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    console.log(resQueryValues.records);
    test.equal(3, resQueryValues.records.length);

    test.done(); 
},

}

exports.notModDBGroup = fiberTests.convertTests( notModDBGroup, true );
exports.group = fiberTests.convertTests( group, false );