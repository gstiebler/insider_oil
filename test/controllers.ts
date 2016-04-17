"use strict"

var fiberTests = require('./lib/fiberTests');
import dbServerController = require('../controllers/dbServerController');
var TreeController = require('../controllers/TreeController');
var loginController = require('../controllers/loginController');
var SearchController = require('../controllers/SearchController');
import ExcelController = require('../controllers/ExcelController');
var Sync = require('sync');
var utils = require('./lib/utils');
//var Future = Sync.Future();


function testRenderFn(test, errorMsg) {
    return function render(viewName, params) {
        test.equal('login', viewName);
        test.equal( errorMsg, params.errorMsg );
    }
}


function iterateTree(children, test) {
    for(let i = 0; i < children.length; i++) {
        const item = children[i];
        if(item.children) {
            iterateTree(item.children, test);
        } else {
            test.ok(item.child, 'Não existe filho para o item ' + item.label);
            const req = {
                query: { 
                    table: item.child.source,
                    filters: JSON.stringify(item.child.filters)
                }
            };
            const response = utils.getJsonResponse.sync(null, dbServerController.main, req);
            test.ok(response.records.length > 0, 'Não há registros em ' + item.label);
            const reqViewRecords = {
            	query: {
            		dataSource: item.child.source,
            		id: response.records[0].id
            	}	
            };
            const responseViewRecords = utils.getJsonResponse.sync(null, dbServerController.viewRecord, reqViewRecords);
            test.ok( responseViewRecords.record.length > 0, 'Problema no viewRecords do datasource ' +  item.child.source)
        }
    }
}

var group = {

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
    
    const errorResponse = utils.getJsonResponse.sync(null, dbServerController.main, req);
    test.equal( 500, errorResponse.code ); // test HTTP error code
    test.equal( "Modelo não encontrado", errorResponse.error.errorMsg );
    test.equal( 0, errorResponse.error.errors.length );
    
    req.query.table = 'Well';
    const response = utils.getJsonResponse.sync(null, dbServerController.main, req);
    // records
    test.equal(3, response.records.length);
    test.equal('1A 0001 BA', response.records[0].name);
    test.equal('Petrobras', response.records[0].operator_name);
    // view params
    test.equal( 'Poços', response.viewParams.tableLabel );
    test.equal( 'name', response.viewParams.labelField );
    test.equal( 'Poço', response.viewParams.fields.name.label );
    test.equal( 'Operador', response.viewParams.fields.operator_name.label );
    test.equal( 'Latitude', response.viewParams.fields.lat.label );
    test.done();
},


listOilFieldsProductionOnshore: function(test) {
   const req = {
        query: { 
            table: 'OilFieldProduction',
            filters: JSON.stringify({ shore: 'off' })
        }
    };    
    
    const response = utils.getJsonResponse.sync(null, dbServerController.main, req);
    // records
    test.equal(1, response.records.length);
    test.equal('Abalone', response.records[0].name);
    // view params
    test.equal( 'Campos', response.viewParams.tableLabel );
    test.equal( 'name', response.viewParams.labelField );
    test.equal( 'Nome', response.viewParams.fields.name.label );
    test.equal( 'Bacia', response.viewParams.fields.basin_name.label );
    test.equal( 'Terra/Mar', response.viewParams.fields.userShore.label );
    test.done();
},


modelFields: function(test) {
    const req = {
        query: { model: 'Well' }
    };
    
    const response = utils.getJsonResponse.sync(null, dbServerController.modelFields, req);
    test.equal(16, response.fields.length);
    test.equal( 'name', response.fields[0].name );
    test.equal( 'Poço', response.fields[0].label );
    test.equal( 'VARCHAR(255)', response.fields[0].type );
    
    test.equal( 'lat', response.fields[2].name );
    test.equal( 'Latitude', response.fields[2].label );
    test.equal( 'DECIMAL(10,6)', response.fields[2].type );
    
    test.equal( 'drilling_rig', response.fields[4].name );
    test.equal( 'Sonda', response.fields[4].label );
    test.equal( 'ref', response.fields[4].type );
    
    test.equal( 'operator_id', response.fields[14].name );
    test.equal( 'Operador', response.fields[14].label );
    test.equal( 'ref', response.fields[14].type );
    test.equal( 'Company', response.fields[14].model );
    test.done();
},


getComboValues: function(test) {
    const req = {
        query: { model: 'Company' }
    };

    const response = utils.getJsonResponse.sync(null, dbServerController.getComboValues, req);
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


createWell: function(test) {
    const req = {
        body: { 
            model: 'Well',
            newItemData: {
                name: '',
                operator_id: 4,
                state: 'AC',
                basin_id: 2,
                lat: 333,
                lng: 444,
                block_id: 2
            }
        }
    };
    
    const errorResponse = utils.getJsonResponse.sync(null, dbServerController.createItem, req);
    test.equal( 400, errorResponse.code ); // test HTTP error code
    test.equal( "Não foi possível criar o registro.", errorResponse.error.errorMsg );
    test.equal( 1, errorResponse.error.errors.length );
    test.equal( "Nome não pode ser nulo", errorResponse.error.errors[0].message );
    
    req.body.newItemData.name = 'Novo poço';
    utils.getJsonResponse.sync(null, dbServerController.createItem, req);
    
    const req2 = {
        query: { table: 'Well' }
    };
    const response = utils.getJsonResponse.sync(null, dbServerController.main, req2);
    test.equal(4, response.records.length);
    test.equal('Novo poço', response.records[3].name);
    test.equal('Statoil', response.records[3].operator_name);
    test.done();
},


editWell: function(test) {
    const req = {
        body: { 
            model: 'Well',
            record: {
                id: 2,
                name: '',
                operator_id: 4,
                state: 'AC',
                bacia: 'Bacia nova',
                lat: 333,
                lng: 444
            }
        }
    };
        
    const errorResponse = utils.getJsonResponse.sync(null, dbServerController.saveItem, req);
    test.equal( 400, errorResponse.code ); // test HTTP error code
    test.equal( "Não foi possível salvar o registro.", errorResponse.error.errorMsg );
    test.equal( 1, errorResponse.error.errors.length );
    test.equal( "Nome não pode ser nulo", errorResponse.error.errors[0].message );
    
    req.body.record.name = 'Novo poço';
    const response = utils.getJsonResponse.sync(null, dbServerController.saveItem, req);
    test.equal('Registro salvo com sucesso.', response.msg);
    
    const req2 = {
        query: { 
            model: 'Well',
            id: 2
        }
    };
    const response2 = utils.getJsonResponse.sync(null, dbServerController.recordValues, req2);
    test.equal('Novo poço', response2.values.name);
    test.equal(4, response2.values.operator_id);
    test.equal(444, response2.values.lng);
    test.done();
},



editFieldOilProduction: function(test) {
    const reqEditValues = {
        body: { 
            model: 'OilFieldProduction',
            record: {
                id: 2,
                name: 'Novo campo',
                operator_id: 4,
                state: 'AC',
                bacia: 'Bacia nova',
                lat: 333,
                lng: 444
            }
        }
    };
        
    const response = utils.getJsonResponse.sync(null, dbServerController.saveItem, reqEditValues);
    test.equal('Registro salvo com sucesso.', response.msg);
    
    const reqGetValues = {
        query: { 
            model: 'OilFieldProduction',
            id: 2
        }
    };
    const responseValues = utils.getJsonResponse.sync(null, dbServerController.recordValues, reqGetValues);
    test.equal('Novo campo', responseValues.values.name);
    test.equal('on', responseValues.values.shore);
    test.equal('Terra', responseValues.values.userShore);
    test.done();
},



getRecordValuesOilFieldProduction: function(test) {
    const req = {
        query: { 
            model: 'OilFieldProduction',
            id: 3
        }
    };
    const response = utils.getJsonResponse.sync(null, dbServerController.recordValues, req);
    test.equal('Abalone', response.values.name);
    test.equal('off', response.values.shore);
    test.equal('Mar', response.values.userShore);
    test.equal('production', response.values.stage);
    test.done();
},


deleteWell: function(test) {
    const req = {
        query: { 
            model: 'Well',
            id: 2
        }
    };
    const response = utils.getJsonResponse.sync(null, dbServerController.deleteItem, req);
    test.equal('Registro apagado com sucesso', response.msg);
    
    const req2 = {
        query: { table: 'Well' }
    };
    const response2 = utils.getJsonResponse.sync(null, dbServerController.main, req2);
    test.equal(2, response2.records.length);
    test.done();
},


doNotDelReferencedObjsInNews: function(test) {
    const camamuId = utils.idByName('Basin', 'Camamu');
    const reqDelCamamu = {
        query: { 
            model: 'Basin',
            id: camamuId
        }
    };
    const resDelCamamu = utils.getJsonResponse.sync(null, dbServerController.deleteItem, reqDelCamamu);
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
        query: { 
            model: 'Basin',
            id: amazonasId
        }
    };
    const resDelAmazonas = utils.getJsonResponse.sync(null, dbServerController.deleteItem, reqDelAmazonas);
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


deleteOilFieldDeveloping: function(test) {
    const reqDelete = {
        query: { 
            model: 'OilFieldDeveloping',
            id: 4
        }
    };
    const responseDelete = utils.getJsonResponse.sync(null, dbServerController.deleteItem, reqDelete);
    test.equal('Registro apagado com sucesso', responseDelete.msg);
    
    const reqGetRecords = {
        query: { table: 'OilFieldDeveloping' }
    };
    const responseGetRecords = utils.getJsonResponse.sync(null, dbServerController.main, reqGetRecords);
    test.equal(2, responseGetRecords.records.length);
    test.done();
},


getRecordViewWell: function(test) {
    const req = {
        query: { 
            dataSource: 'Well',
            id: 2
        }
    };

    const response = utils.getJsonResponse.sync(null, dbServerController.viewRecord, req);
    const record = response.record;
    test.equal(16, record.length);
    test.equal('Poço', record[0].label);
    test.equal('1AGIP1RJS', record[0].value);
    
    test.equal('Reclassificação', record[7].label);
    test.equal('Latitude', record[2].label);
    
    test.equal('Sonda', record[4].label);
    test.equal('NIC-01', record[4].name);
    
    test.equal('Operador', record[14].label);
    test.equal(2, record[14].value);
    test.equal(true, record[14].ref);
    test.equal('Company', record[14].model);
    test.equal('Eni Oil', record[14].name);
    
    test.done();
},


createOilFieldDeveloping: function(test) {
    const req = {
        body: { 
            model: 'OilFieldDeveloping',
            newItemData: {
                name: 'Gavião Azul',
                basin_id: 2,
                state: 'Maranhão',
                concessionaries: 'Parnaíba Gás¹ (70)/BPMB Parnaíba (30)',
                userShore: 'Terra'
            }
        }
    };
    
    utils.getJsonResponse.sync(null, dbServerController.createItem, req);
    
    const reqGet = {
        query: { 
            dataSource: 'OilFieldDeveloping',
            id: 7
        }
    };
    const responseDeveloping = utils.getJsonResponse.sync(null, dbServerController.viewRecord, reqGet);
    test.equal('Gavião Azul', responseDeveloping.record[0].value);
    test.equal('Acre', responseDeveloping.record[4].name);
    test.equal('Terra', responseDeveloping.record[3].value);
    
    const reqOilFieldProduction = {
        query: { 
            dataSource: 'OilFieldProduction',
            id: 7
        }
    };
    const responseProduction = utils.getJsonResponse.sync(null, dbServerController.viewRecord, reqOilFieldProduction);
    test.equal(5, responseProduction.record.length);   
    
    test.done();
},


loginHTML: function(test) {
    const req = {
        body: { 
            username: 'lasdfkh',
            password: 'adgfagasdf'
        }
    };
    
    // test invalid user
    const res = { render: testRenderFn(test, 'Usuário não existe') };
    loginController.makeLogin(req, res);
    
    // test invalid password
    const res2 = { render: testRenderFn(test, 'A senha está incorreta') };
    req.body.username = 'gstiebler';
    loginController.makeLogin(req, res2);
    
    // test everything ok
    req.body.password = 'guilherme';
    const res3 = { redirect: redirect };
    loginController.makeLogin(req, res3);
    
    function redirect(url) {
        test.equal( '/app/templates/index.html?token', url.split('=')[0] );
        test.done();
    }
},


adminTablesIntegrity: test => {
    const responseAdminDataSources = utils.getJsonResponse.sync(null, dbServerController.sourcesList, null);
    for(const dataSourceName in responseAdminDataSources) {
        const req = {
            query: { table: dataSourceName }
        };
        let responseRecords = utils.getJsonResponse.sync(null, dbServerController.main, req);
        test.ok(responseRecords.records, 'Problem with model ' + dataSourceName);
        if(responseRecords.records) {
            test.ok(responseRecords.records.length >= 2, 'Problem with model ' + dataSourceName + 
                    ', records: ' +responseRecords.records.length);
        }
    }
    test.done();
},


treeIntegrity: test => {
    const tree = utils.getJsonResponse.sync(null, TreeController.main, null);
    iterateTree(tree.children, test);
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
	    'FixedUEPProduction',
	    'FPSOProduction',
	    'News',
	    'OilField',
	    'Person',
	    'Production',
	    'Reserve',
	    'Seismic',
	    'Well'
	];
	
	for(var model of models) {
	    const req = {
	        query: { 
	            table: model,
	        }
	    };
	    const response = utils.getJsonResponse.future(null, dbServerController.main, req);
	    for(var gridField of response.result.viewParams.gridFields) {
	    	if(gridField == 'id') continue;
	    	test.ok(response.result.viewParams.fields[gridField], 'Grid field not found: ' + gridField + ' in ' + model);
	    }
	}
	test.done();
},


search: test => {
	const req = {
		query: { searchValue: 'guilherme' }
	}
    var searchResults = utils.getJsonResponse.sync(null, SearchController.main, req);
	test.equal(1, searchResults.length);
    test.equal('Guilherme Stiebler', searchResults[0].name);
    test.equal('Person', searchResults[0].model);
    test.equal(1, searchResults[0].id);
    
    req.query.searchValue = 'ba';
    searchResults = utils.getJsonResponse.sync(null, SearchController.main, req);
	test.equal(5, searchResults.length);
    test.equal('BM-BAR-1', searchResults[0].name);
    test.equal('Block', searchResults[0].model);
    test.equal('Parnaíba Gás Natural', searchResults[2].name);
    test.equal('Company', searchResults[2].model);
    
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
    const resRecordValues = utils.getJsonResponse.sync(null, dbServerController.recordValues, reqRecordValues);

    test.equal(2, resRecordValues.values.blocks.length);
    test.equal('BM-BAR-1', resRecordValues.values.blocks[0].name);
    test.equal('ES-M-529', resRecordValues.values.blocks[1].name);
    
    test.done();
},


importBlocksFromURL: function(test) {
    const reqImport = {
        body: { 
            params: { dataSource: 'Block' },
        }
    };
    const resImport = utils.getJsonResponse.sync(null, ExcelController.importExcelFromURL, reqImport);    
    test.equal('Registros criados: 341\nRegistros atualizados: 3\nRegistros inválidos: 3', resImport.status);


   const reqListBlocks = {
        query: { 
            table: 'Block',
        }
    };    
    
    const resListBlocks = utils.getJsonResponse.sync(null, dbServerController.main, reqListBlocks);
    // records
    test.equal(344, resListBlocks.records.length);
    
    test.done();
},


customComboQuery: (test) => {
    const req = {
        query: { model: 'AllDrillingRigs' }
    };

    const response = utils.getJsonResponse.sync(null, dbServerController.getComboValues, req);
    test.equal(6, response.length);    
    test.equal('1:offshore', response[0].id);
    test.equal('Aban Abraham', response[0].label);
    test.equal('1:onshore', response[1].id);
    test.equal('BS-04', response[1].label);
    test.done();
},


};

fiberTests.convertTests( exports, group );