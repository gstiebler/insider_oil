"use strict";
var fiberTests = require('./lib/fiberTests');
var dbServerController = require('../controllers/dbServerController');


var group = {

listWells: function(test) {
    const req = {
        query: { table: 'Well' }
    };
    const res = { json: jsonRes };
    dbServerController.main(req, res);
    
    function jsonRes(response) {
        var str = JSON.stringify(response);
        var objBack = JSON.parse(str);
        // records
        test.equal(3, objBack.records.length);
        test.equal('1A 0001 BA', objBack.records[0].name);
        test.equal('Petrobrás', objBack.records[0].operator_name);
        // view params
        test.equal( 'Poços', response.viewParams.tableLabel );
        test.equal( 'name', response.viewParams.labelField );
        test.equal( 'Poço', response.viewParams.fields.name.label );
        test.equal( 'Operador', response.viewParams.fields.operator_name.label );
        test.equal( 'Latitude', response.viewParams.fields.lat.label );
        test.done();
    }
},


modelFields: function(test) {
    const req = {
        query: { model: 'Well' }
    };
    const res = { json: jsonRes };
    dbServerController.modelFields(req, res)
    
    function jsonRes(response) {
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
    }
},


getComboValues: function(test) {
    const req = {
        query: { model: 'Company' }
    };
    const res = { json: jsonRes };
    dbServerController.getComboValues(req, res)
    
    function jsonRes(response) {
        test.equal( 1, response[0].id );
        test.equal( 2, response[1].id );
        test.equal( 6, response[5].id );
        test.equal( 7, response[6].id );
        
        test.equal( 'Petrobrás', response[0].label );
        test.equal( 'Eni Oil', response[1].label );
        test.equal( 'Schahin', response[5].label );
        test.equal( 'Paragon', response[6].label );
        test.done();
    }
},


createWell: function(test) {
    const req = {
        body: { 
            model: 'Well',
            newItemData: {
                name: 'Novo poço',
                operator_id: 4,
                state: 'AC',
                bacia: 'Bacia nova',
                lat: 333,
                lng: 444
            }
        }
    };
    const res = { json: function(){} };
    dbServerController.createItem(req, res);
    
    res.json = jsonRes;
    const req2 = {
        query: { table: 'Well' }
    };
    dbServerController.main(req2, res);
    
    function jsonRes(response) {
        var str = JSON.stringify(response);
        var objBack = JSON.parse(str);
        test.equal(4, response.records.length);
        test.equal('Novo poço', objBack.records[3].name);
        test.equal('Statoil', objBack.records[3].operator_name);
        test.done();
    }
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
    const res = { json: function(response){ 
        test.equal('OK', response.msg);
        
        const res2 = { json: jsonRes };
        const req2 = {
            query: { 
                model: 'Well',
                id: 2
            }
        };
        dbServerController.recordValues(req2, res2);
    }};
    dbServerController.saveItem(req, res);
    
    function jsonRes(response) {
        test.equal('Novo poço', response.values.name);
        test.equal(4, response.values.operator_id);
        test.equal(444, response.values.lng);
        test.done();
    }
},


deleteWell: function(test) {
    const req = {
        query: { 
            model: 'Well',
            id: 2
        }
    };
    const res = { json: function(response){ test.equal('OK', response.msg) } };
    dbServerController.deleteItem(req, res);
    
    const req2 = {
        query: { table: 'Well' }
    };
    const res2 = { json: jsonRes };
    dbServerController.main(req2, res2);
    
    function jsonRes(response) {
        test.equal(2, response.records.length);
        test.done();
    }
}

};

fiberTests.convertTests( exports, group );