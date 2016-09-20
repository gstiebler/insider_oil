"use strict"

import fiberTests = require('./lib/fiberTests');
import nodeunit = require('nodeunit');
import * as AdminController from '../controllers/AdminController';
import dbServerController = require('../controllers/dbServerController');
import * as ni from '../../common/NetworkInterfaces';
import db = require('../db/models');
var utils = require('./lib/utils');
import { await } from '../lib/await';

var group:nodeunit.ITestGroup = {

createWell: (test: nodeunit.Test) => {
    const newItemData = {
        name: '',
        operator_id: 4,
        state: 'AC',
        basin_id: 2,
        lat: 333,
        lng: 444,
        block_id: 2
    }
    const req = {
        body: { 
            model: 'Well',
            newItemData: JSON.stringify(newItemData)
        }
    };
    
    const errorResponse = utils.getJsonResponse.sync(null, AdminController.createItem, req);
    test.equal( 400, errorResponse.code ); // test HTTP error code
    test.equal( "Não foi possível criar o registro. Validation error: Nome não pode ser nulo", errorResponse.error.errorMsg );
    test.equal( 1, errorResponse.error.errors.length );
    test.equal( "Nome não pode ser nulo", errorResponse.error.errors[0].message );
    
    newItemData.name = 'Novo poço';
    req.body.newItemData = JSON.stringify(newItemData);
    utils.getJsonResponse.sync(null, AdminController.createItem, req);
    
    const query: ni.GetTableData.req = { 
        table: 'Well',
        order: [{
            fieldName: 'name',
            dir: 'asc'
        }] 
    }; 
    const req2 = { query };
    const response:ni.GetTableData.res = 
        utils.getJsonResponse.sync(null, AdminController.getTableData, req2);
    test.equal(11, response.records.length);
    test.equal('Novo poço', response.records[10].name);
    test.equal('Statoil', response.records[10].operator_name);
    test.done();
},

editWell: function(test) {
    const record = {
        id: 2,
        name: '',
        operator_id: 4,
        state: 'AC',
        bacia: 'Bacia nova',
        lat: 333,
        lng: 444
    }
    const req = {
        body: { 
            model: 'Well',
            record: JSON.stringify(record)
        }
    };
        
    const errorResponse = utils.getJsonResponse.sync(null, AdminController.saveItem, req);
    test.equal( 400, errorResponse.code ); // test HTTP error code
    test.equal( "Não foi possível salvar o registro. Validation error: Nome não pode ser nulo", errorResponse.error.errorMsg );
    test.equal( 1, errorResponse.error.errors.length );
    test.equal( "Nome não pode ser nulo", errorResponse.error.errors[0].message );
    
    record.name = 'Novo poço';
    req.body.record = JSON.stringify(record);
    const response = utils.getJsonResponse.sync(null, AdminController.saveItem, req);
    test.equal('Registro salvo com sucesso.', response.msg);
    
    const req2 = {
        query: { 
            model: 'Well',
            id: 2
        }
    };
    const response2 = utils.getJsonResponse.sync(null, AdminController.recordValues, req2);
    test.equal('Novo poço', response2.values.name);
    test.equal(4, response2.values.operator_id);
    test.equal(444, response2.values.lng);
    test.done();
},


deleteWell: function(test) {
    const req = {
        body: { 
            model: 'Well',
            id: 2
        }
    };
    const response = utils.getJsonResponse.sync(null, AdminController.deleteItem, req);
    test.equal('Registro apagado com sucesso', response.msg);
    
    const req2 = {
        query: { table: 'Well' }
    };
    const response2:ni.GetTableData.res = 
        utils.getJsonResponse.sync(null, AdminController.getTableData, req2);
    test.equal(9, response2.records.length);
    test.done();
},


doNotDelReferencedObjsInNews: function(test) {
    const camamuId = utils.idByName('Basin', 'Camamu');
    const reqDelCamamu = {
        body: { 
            model: 'Basin',
            id: camamuId
        }
    };
    const resDelCamamu = utils.getJsonResponse.sync(null, AdminController.deleteItem, reqDelCamamu);
    test.equal('Não foi possível apagar o registro.', resDelCamamu.error.errorMsg);
    
    const reqGetCamamu = {
        query: { 
            dataSource: 'Basin',
            id: camamuId
        }
    };

    const resGetCamamu = utils.getJsonResponse.sync(null, dbServerController.viewRecord, reqGetCamamu);
    const record = resGetCamamu.record;
    test.equal('Camamu', record[0].value);
    test.done();
},


doNotDelReferencedPersonProject: function(test) {
    const amazonasId = utils.idByName('Basin', 'Amazonas');
    const reqDelAmazonas = {
        body: { 
            model: 'Basin',
            id: amazonasId
        }
    };
    const resDelAmazonas = utils.getJsonResponse.sync(null, AdminController.deleteItem, reqDelAmazonas);
    test.equal('Não foi possível apagar o registro.', resDelAmazonas.error.errorMsg);
    
    const reqGetAmazonas = {
        query: { 
            dataSource: 'Basin',
            id: amazonasId
        }
    };

    const resGetAmazonas = utils.getJsonResponse.sync(null, dbServerController.viewRecord, reqGetAmazonas);
    const record = resGetAmazonas.record;
    test.equal('Amazonas', record[0].value);
    test.done();
},

editContractTestUpdates: function(test) {
    const firstId = utils.idByValue('Contract', 'user_uid', '001');
    const record = {
        id: firstId,
        value: 43707266.86,
        supplier_identifier: '02.805.820/0001-86',            
        start: '2011-02-15',
        end: '2019-02-11T02:00:00.000Z',
    }
    const reqEditItem = {
        body: { 
            model: 'Contract',
            record: JSON.stringify(record)
        }
    };
        
    const response = utils.getJsonResponse.sync(null, AdminController.saveItem, reqEditItem);
    test.equal('Registro salvo com sucesso.', response.msg);
    
    const updates = await( db.models.UpdateLog.findAll({order: [['id', 'DESC']] }) );
    const lastUpdate = updates[0];
    test.equal('Contract', lastUpdate.model);
    test.equal('EDIT', lastUpdate.type);
    const updatedFields = JSON.parse(lastUpdate.updates);
    test.equal(1, updatedFields.length);
    test.equal('start', updatedFields[0]);

    test.done();
},

editOilFieldTestUpdates: function(test) {
    const nordicId = utils.idByName('Fleet', 'Nordic Rio');
    const record = {
        id: nordicId,
        year: 2004,
        country: 'Liberland',
        type: 'Aliviador',
        weight: 1234
    }
    const reqEditItem = {
        body: { 
            model: 'Fleet',
            record: JSON.stringify(record)
        }
    };
        
    const response = utils.getJsonResponse.sync(null, AdminController.saveItem, reqEditItem);
    test.equal('Registro salvo com sucesso.', response.msg);
    
    const updates = await( db.models.UpdateLog.findAll({order: [['id', 'DESC']] }) );
    const lastUpdate = updates[0];
    test.equal('Fleet', lastUpdate.model);
    test.equal('EDIT', lastUpdate.type);
    const updatedFields = JSON.parse(lastUpdate.updates);
    test.equal(2, updatedFields.length);
    test.equal('country', updatedFields[0]);
    test.equal('weight', updatedFields[1]);

    test.done();
},

}

var notModDBGroup:nodeunit.ITestGroup = {


listWells: function(test) {
    const req = {
        query: { 
            table: 'Well2',
            fieldNames: [
                'name', 
                'operator_name',
                'basin_name'
            ]
        }
    };    
    
    const errorResponse = utils.getJsonResponse.sync(null, AdminController.getTableData, req);
    test.equal( 500, errorResponse.code ); // test HTTP error code
    test.equal( "Modelo não encontrado", errorResponse.error.errorMsg );
    test.equal( 0, errorResponse.error.errors.length );
    
    const query2: ni.GetTableData.req = { 
        table: 'Well',
        order: [{
            fieldName: 'name',
            dir: 'asc'
        }] 
    }; 
    const req2 = { query: query2 };
    const res2:ni.GetTableData.res = utils.getJsonResponse.sync(null, AdminController.getTableData, req2);
    // records
    test.equal(10, res2.records.length);
    test.equal('1A 0001 BA', res2.records[0].name);
    test.equal('Petrobras', res2.records[0].operator_name);
    test.done();
},

getWellsViewParams: (test: nodeunit.Test) => { 
    const query:ni.GetViewParams.req = { table: 'Well' };  
    const req = { query };
    const res:ni.GetViewParams.res = utils.getJsonResponse.sync(null, AdminController.getViewParams, req);

    test.equal( 'Poços', res.viewParams.tableLabel );
    test.equal( 'name', res.viewParams.labelField );
    test.equal( 'Poço', res.viewParams.fields['name'].label );
    test.equal( 'Operador', res.viewParams.fields['operator_name'].label );
    test.equal( 'Latitude', res.viewParams.fields['lat'].label );
    test.done();
},

modelFields: function(test) {
    const req = {
        query: { model: 'Well' }
    };
    
    const response = utils.getJsonResponse.sync(null, AdminController.modelFields, req);
    test.equal(19, response.fields.length);
    test.equal( 'name', response.fields[0].name );
    test.equal( 'Poço', response.fields[0].label );
    test.equal( 'VARCHAR(255)', response.fields[0].type );
    
    test.equal( 'lat', response.fields[2].name );
    test.equal( 'Latitude', response.fields[2].label );
    test.equal( 'DECIMAL(10,6)', response.fields[2].type );
    
    test.equal( 'drilling_rig', response.fields[4].name );
    test.equal( 'Sonda', response.fields[4].label );
    test.equal( 'ref', response.fields[4].type );
    
    test.equal( 'operator_id', response.fields[15].name );
    test.equal( 'Operador', response.fields[15].label );
    test.equal( 'ref', response.fields[15].type );
    test.equal( 'Company', response.fields[15].model );
    test.done();
},

getComboValues: function(test) {
    const req = {
        query: { model: 'Company' }
    };

    const response = utils.getJsonResponse.sync(null, AdminController.getComboValues, req);
    test.equal(46, response.length);
    
    test.equal( utils.idByName('Company', 'Alvopetro'), response[0].id );
    test.equal( utils.idByName('Company', 'Anadarko'), response[1].id );
    test.equal( utils.idByName('Company', 'UTC EP'), response[44].id );
    test.equal( utils.idByName('Company', 'Vipetro'), response[45].id );
    
    test.equal( 'Alvopetro', response[0].label );
    test.equal( 'Anadarko', response[1].label );
    test.equal( 'UTC EP', response[44].label );
    test.equal( 'Vipetro', response[45].label );
    test.done();
},

adminTablesIntegrity: test => {
    const responseAdminDataSources = utils.getJsonResponse.sync(null, AdminController.sourcesList, null);
    for(const dataSourceName in responseAdminDataSources) {
        const req = {
            query: { table: dataSourceName }
        };
        let responseRecords:ni.GetTableData.res = 
            utils.getJsonResponse.sync(null, AdminController.getTableData, req);
        test.ok(responseRecords.records, 'Problem with model ' + dataSourceName);
        if(responseRecords.records) {
            test.ok(responseRecords.records.length >= 2, 'Problem with model ' + dataSourceName + 
                    ', records: ' +responseRecords.records.length);
        }
    }
    test.done();
},

allTablesMain: test => {
	const models = [
	    'AmbientalLicense',
	    'Basin',
	    'Block',
	    'Company',
	    'DrillingRigOffshore',
	    'DrillingRigOnshore',
	    'News',
	    'OilField',
	    'Person',
	    'Reserve', 
	    'Seismic',
	    'Well',
	    'ProductionUnit',
	    'Refinery',
	    'Terminal',
	    'Fleet',
	    'Bid',
	    'Contract',
	    'GasPipeline',
	    'OilPipeline',
	    'GasMovement',
	    'IndustrySegment',
	    'MaintenanceDate',
	    'ErrorReport',
        'Boat',
        'Project',
	];
	
	for(var model of models) {
	    const req = {
	        query: { 
	            table: model,
	        }
	    };
        try {
            const response:ni.GetViewParams.res = 
                    utils.getJsonResponse.sync(null, AdminController.getViewParams, req);
            for(var gridField of response.viewParams.gridFields) {
                if(gridField == 'id') continue;
                test.ok(response.viewParams.fields[gridField], 'Grid field not found: ' + gridField + ' in ' + model);
            }
        } catch(err) {
            test.ok(false, err + ' on table ' + model);
        }
	}
	test.done();
},

getAmbientalLicensesRecordValues: function(test) {
    const ambientalLicenseId = utils.idByValue('AmbientalLicense', 'license', 'ABio 560/2014');
    const reqRecordValues = {
        query: { 
            model: 'AmbientalLicense',
            id: ambientalLicenseId
        }
    };
    const resRecordValues = utils.getJsonResponse.sync(null, AdminController.recordValues, reqRecordValues);

    test.equal(2, resRecordValues.values.blocks.length);
    test.equal('BM-BAR-1', resRecordValues.values.blocks[0].name);
    test.equal('ES-M-529', resRecordValues.values.blocks[1].name);
    
    test.done();
},

customComboQuery: (test) => {
    const req = {
        query: { model: 'AllDrillingRigs' }
    };

    const response = utils.getJsonResponse.sync(null, AdminController.getComboValues, req);
    test.equal(6, response.length);    
    test.equal('1:offshore', response[0].id);
    test.equal('Aban Abraham', response[0].label);
    test.equal('1:onshore', response[1].id);
    test.equal('BS-04', response[1].label);
    test.done();
},

listCompaniesPagination: function(test) {
    const query: ni.GetTableData.req = { 
        table: 'Company',
        pagination: {
            first: '10',
            itemsPerPage: '7'
        },
        order: [
            {
                fieldName: 'name',
                dir: 'DESC'
            }
        ]
    } 
    const req = { query };    
    const res:ni.GetTableData.res = utils.getJsonResponse.sync(null, AdminController.getTableData, req);
    // records
    test.equal(7, res.records.length);
    test.equal('Rosneft', res.records[0].name);
    test.equal('Petrobras', res.records[6].name);
    test.done();
},

listCompaniesSearch: function(test) {
    const query: ni.GetTableData.req = { 
        table: 'Company',
        pagination: {
            first: '0',
            itemsPerPage: '7'
        },
        order: [
            {
                fieldName: 'name',
                dir: 'DESC'
            }
        ],
        filters: [
            {
                field: 'name',
                value: 'petro'
            }
        ]
    } 
    const req = { query };    
    const res:ni.GetTableData.res = utils.getJsonResponse.sync(null, AdminController.getTableData, req);
    // records
    test.equal(7, res.records.length);
    test.equal('Vipetro', res.records[0].name);
    test.equal('Alvopetro', res.records[6].name);
    test.done();
},

}

exports.notModDBGroup = fiberTests.convertTests( notModDBGroup, true );
exports.group = fiberTests.convertTests( group, false );