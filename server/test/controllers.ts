"use strict"

import fiberTests = require('./lib/fiberTests');
import dbServerController = require('../controllers/dbServerController');
import ExcelController = require('../controllers/ExcelController');
import QueryGenerator = require('../db/queries/QueryGenerator');
import nodeunit = require('nodeunit');
var loginController = require('../controllers/loginController');
import SearchController = require('../controllers/SearchController');
var Sync = require('sync');
var utils = require('./lib/utils');
import * as ni from '../../common/NetworkInterfaces';


function testRenderFn(test, errorMsg) {
    return function render(viewName, params) {
        test.equal('login', viewName);
        test.equal( errorMsg, params.errorMsg );
    }
}

var group:nodeunit.ITestGroup = {

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
        test.equal( '/app/index.html?token', url.split('=')[0] );
        test.done();
    }
},

/*
importBlocksFromURL: function(test) {
    const reqImport = {
        body: { 
            params: { dataSource: 'Block' },
        }
    };
    const resImport = utils.getJsonResponse.sync(null, ExcelController.importExcelFromURL, reqImport);    
    //test.equal('Registros criados: 341\nRegistros atualizados: 3\nRegistros inválidos: 3', resImport.status);

   const reqListBlocks = {
        query: { 
            table: 'Block',
        }
    };    
    
    const resListBlocks:ni.GetTableData.res = 
        utils.getJsonResponse.sync(null, dbServerController.getTableData, reqListBlocks);
    // records
    test.ok(resListBlocks.records.length > 330);
    
    test.done();
},
*/

};

var notModDBGroup:nodeunit.ITestGroup = {

getRecordViewWell: function(test) {
    const req = {
        query: { 
            dataSource: 'Well',
            id: 2
        }
    };

    const response = utils.getJsonResponse.sync(null, dbServerController.viewRecord, req);
    const record = response.record;
    test.equal(19, record.length);
    test.equal('Poço', record[0].label);
    test.equal('1AGIP1RJS', record[0].value);
    
    test.equal('Reclassificação', record[8].label);
    test.equal('Latitude', record[2].label);
    
    test.equal('Sonda', record[4].label);
    test.equal('NIC-01', record[4].name);
    
    test.equal('Operador', record[15].label);
    test.equal(2, record[15].value);
    test.equal(true, record[15].ref);
    test.equal('Company', record[15].model);
    test.equal('Eni Oil', record[15].name);
    
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

dashboard: test => {
    var dashboardData:ni.GetDashboardData.res = 
        utils.getJsonResponse.sync(null, dbServerController.getDashboardData, {});
	test.equal(3, dashboardData.numBids);
	test.equal(3, dashboardData.numContracts);
	test.equal(3, dashboardData.numPersons);
	test.equal(2, dashboardData.numProjects);
    
    test.done();
},

getRecord: test => {
    const query:ni.GetRecord.req = {
        optionsName: 'SingleNews',
        id: utils.idByValue('News', 'title', 'Petrobrás compra Statoil')
    }
    const res:ni.GetRecord.res = 
        utils.getJsonResponse.sync(null, dbServerController.getRecord, { query });

    test.equal('Petrobrás compra Statoil', res.record.title);
    
    test.done();
},

getTableQueriesFields: (test: nodeunit.Test) => { 
    const res:ni.GetTableQueriesFields.res = 
        utils.getJsonResponse.sync(null, dbServerController.getTableQueriesFields, {});
    
    test.equal('Nome', res['Blocks'][0].label);
    test.done();
},

}

exports.notModDBGroup = fiberTests.convertTests( notModDBGroup, true );
exports.group = fiberTests.convertTests( group, false );