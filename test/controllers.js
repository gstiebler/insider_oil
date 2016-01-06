"use strict";
var fiberTests = require('./lib/fiberTests');
var dbServerController = require('../controllers/dbServerController');
var TreeController = require('../controllers/TreeController');
var loginController = require('../controllers/loginController');
//var Sync = require('sync');

function deStringify(json) {
    var str = JSON.stringify(json);
    return JSON.parse(str);
}

function getJsonResponse(func, req, callback) {
    const res = { 
        json: jsonRes,
        status: status
    };
    func(req, res);
    
    function jsonRes(response) {
        callback(null, deStringify(response) );
    }
    
    function status(code) {
        const result = { 
            json: function(response) { 
                callback(null, { code: code, error: deStringify(response) } );
            } 
        };
        return result;
    }
}

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
            const response = getJsonResponse.sync(null, dbServerController.main, req);
            test.ok(response.records.length > 0, 'Não há registros em ' + item.label);
        }
    }
}

var group = {

listWells: function(test) {
    const req = {
        query: { table: 'Well2' }
    };    
    
    const errorResponse = getJsonResponse.sync(null, dbServerController.main, req);
    test.equal( 500, errorResponse.code ); // test HTTP error code
    test.equal( "Modelo não encontrado", errorResponse.error.errorMsg );
    test.equal( 0, errorResponse.error.errors.length );
    
    req.query.table = 'Well';
    const response = getJsonResponse.sync(null, dbServerController.main, req);
    // records
    test.equal(3, response.records.length);
    test.equal('1A 0001 BA', response.records[0].name);
    test.equal('Petrobrás', response.records[0].operator_name);
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
    
    const response = getJsonResponse.sync(null, dbServerController.main, req);
    // records
    test.equal(1, response.records.length);
    test.equal('Abalone', response.records[0].name);
    // view params
    test.equal( 'Campos', response.viewParams.tableLabel );
    test.equal( 'name', response.viewParams.labelField );
    test.equal( 'Nome', response.viewParams.fields.name.label );
    test.equal( 'Bacia', response.viewParams.fields.basin.label );
    test.equal( 'Terra/Mar', response.viewParams.fields.userShore.label );
    test.done();
},


modelFields: function(test) {
    const req = {
        query: { model: 'Well' }
    };
    
    const response = getJsonResponse.sync(null, dbServerController.modelFields, req);
    
    test.equal( 'name', response.fields[0].name );
    test.equal( 'Poço', response.fields[0].label );
    test.equal( 'VARCHAR(255)', response.fields[0].type );
    test.equal( 'lat', response.fields[3].name );
    test.equal( 'Latitude', response.fields[3].label );
    test.equal( 'DECIMAL', response.fields[3].type );
    test.equal( 'operator_id', response.fields[5].name );
    test.equal( 'Operador', response.fields[5].label );
    test.equal( 'ref', response.fields[5].type );
    test.equal( 'Company', response.fields[5].model );
    test.done();
},


getComboValues: function(test) {
    const req = {
        query: { model: 'Company' }
    };

    const response = getJsonResponse.sync(null, dbServerController.getComboValues, req);
    
    test.equal( 1, response[0].id );
    test.equal( 2, response[1].id );
    test.equal( 6, response[5].id );
    test.equal( 7, response[6].id );
    
    test.equal( 'Petrobrás', response[0].label );
    test.equal( 'Eni Oil', response[1].label );
    test.equal( 'Schahin', response[5].label );
    test.equal( 'Paragon', response[6].label );
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
                bacia: 'Bacia nova',
                lat: 333,
                lng: 444
            }
        }
    };
    
    const errorResponse = getJsonResponse.sync(null, dbServerController.createItem, req);
    test.equal( 400, errorResponse.code ); // test HTTP error code
    test.equal( "Não foi possível criar o registro.", errorResponse.error.errorMsg );
    test.equal( 1, errorResponse.error.errors.length );
    test.equal( "Nome não pode ser nulo", errorResponse.error.errors[0].message );
    
    req.body.newItemData.name = 'Novo poço';
    getJsonResponse.sync(null, dbServerController.createItem, req);
    
    const req2 = {
        query: { table: 'Well' }
    };
    const response = getJsonResponse.sync(null, dbServerController.main, req2);
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
        
    const errorResponse = getJsonResponse.sync(null, dbServerController.saveItem, req);
    test.equal( 400, errorResponse.code ); // test HTTP error code
    test.equal( "Não foi possível salvar o registro.", errorResponse.error.errorMsg );
    test.equal( 1, errorResponse.error.errors.length );
    test.equal( "Nome não pode ser nulo", errorResponse.error.errors[0].message );
    
    req.body.record.name = 'Novo poço';
    const response = getJsonResponse.sync(null, dbServerController.saveItem, req);
    test.equal('Registro salvo com sucesso.', response.msg);
    
    const req2 = {
        query: { 
            model: 'Well',
            id: 2
        }
    };
    const response2 = getJsonResponse.sync(null, dbServerController.recordValues, req2);
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
        
    const response = getJsonResponse.sync(null, dbServerController.saveItem, reqEditValues);
    test.equal('Registro salvo com sucesso.', response.msg);
    
    const reqGetValues = {
        query: { 
            model: 'OilFieldProduction',
            id: 2
        }
    };
    const responseValues = getJsonResponse.sync(null, dbServerController.recordValues, reqGetValues);
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
    const response = getJsonResponse.sync(null, dbServerController.recordValues, req);
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
    const response = getJsonResponse.sync(null, dbServerController.deleteItem, req);
    test.equal('Registro apagado com sucesso', response.msg);
    
    const req2 = {
        query: { table: 'Well' }
    };
    const response2 = getJsonResponse.sync(null, dbServerController.main, req2);
    test.equal(2, response2.records.length);
    test.done();
},


deleteOilFieldDeveloping: function(test) {
    const reqDelete = {
        query: { 
            model: 'OilFieldDeveloping',
            id: 4
        }
    };
    const responseDelete = getJsonResponse.sync(null, dbServerController.deleteItem, reqDelete);
    test.equal('Registro apagado com sucesso', responseDelete.msg);
    
    const reqGetRecords = {
        query: { table: 'OilFieldDeveloping' }
    };
    const responseGetRecords = getJsonResponse.sync(null, dbServerController.main, reqGetRecords);
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

    const response = getJsonResponse.sync(null, dbServerController.viewRecord, req);
    test.equal('Poço', response[0].label);
    test.equal('Estado', response[1].label);
    test.equal('Latitude', response[3].label);
    test.equal('Operador', response[5].label);
    
    test.equal('1AGIP1RJS', response[0].value);
    
    test.equal(2, response[5].value);
    test.equal(true, response[5].ref);
    test.equal('Company', response[5].source);
    test.equal('Eni Oil', response[5].name);
    
    test.done();
},


createOilFieldDeveloping: function(test) {
    const req = {
        body: { 
            model: 'OilFieldDeveloping',
            newItemData: {
                name: 'Gavião Azul',
                basin: 'Parnaíba',
                state: 'Maranhão',
                concessionaries: 'Parnaíba Gás¹ (70)/BPMB Parnaíba (30)',
                userShore: 'Terra'
            }
        }
    };
    
    getJsonResponse.sync(null, dbServerController.createItem, req);
    
    const reqOilFieldDeveloping = {
        query: { table: 'OilFieldDeveloping' }
    };
    const responseDeveloping = getJsonResponse.sync(null, dbServerController.main, reqOilFieldDeveloping);
    test.equal(4, responseDeveloping.records.length);
    test.equal('Gavião Azul', responseDeveloping.records[3].name);
    test.equal('Parnaíba', responseDeveloping.records[3].basin);
    test.equal('on', responseDeveloping.records[3].shore);
    test.equal('Terra', responseDeveloping.records[3].userShore);
    
    const reqOilFieldProduction = {
        query: { table: 'OilFieldProduction' }
    };
    const responseProduction = getJsonResponse.sync(null, dbServerController.main, reqOilFieldProduction);
    test.equal(3, responseProduction.records.length);   
    
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
    const responseAdminDataSources = getJsonResponse.sync(null, dbServerController.sourcesList, null);
    for(const dataSourceName in responseAdminDataSources) {
        const req = {
            query: { table: dataSourceName }
        };
        let responseRecords = getJsonResponse.sync(null, dbServerController.main, req);
        test.ok(responseRecords.records, 'Problem with model ' + dataSourceName);
        if(responseRecords.records) {
            test.ok(responseRecords.records.length >= 2, 'Problem with model ' + dataSourceName + 
                    ', records: ' +responseRecords.records.length);
        }
    }
    test.done();
},


treeIntegrity: test => {
    const tree = getJsonResponse.sync(null, TreeController.main, null);
    iterateTree(tree.children, test);
    test.done();
}

};

fiberTests.convertTests( exports, group );