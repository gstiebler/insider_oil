"use strict";
var fiberTests = require('./lib/fiberTests');
var dbServerController = require('../controllers/dbServerController');
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

var group = {

listWells: function(test) {
    const req = {
        query: { table: 'Well' }
    };
    
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
                name: 'Novo poço',
                operator_id: 4,
                state: 'AC',
                bacia: 'Bacia nova',
                lat: 333,
                lng: 444
            }
        }
    };
    
    const response = getJsonResponse.sync(null, dbServerController.saveItem, req);
    test.equal('OK', response.msg);
    
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


deleteWell: function(test) {
    const req = {
        query: { 
            model: 'Well',
            id: 2
        }
    };
    const response = getJsonResponse.sync(null, dbServerController.deleteItem, req);
    test.equal('OK', response.msg);
    
    const req2 = {
        query: { table: 'Well' }
    };
    const response2 = getJsonResponse.sync(null, dbServerController.main, req2);
    test.equal(2, response2.records.length);
    test.done();
}

};

fiberTests.convertTests( exports, group );