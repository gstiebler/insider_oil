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
        test.equal(3, response.records.length);
        test.equal('1A 0001 BA', response.records[0].name);
        test.done();
    }
},


createWell: function(test) {
    const req = {
        body: { 
            model: 'Well',
            newItemData: {
                name: 'Novo poço',
                operator: 'Novo operador',
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
        test.equal(4, response.records.length);
        test.equal('Novo poço', response.records[3].name);
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
                operator: 'Novo operador',
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
        test.equal('Novo operador', response.values.operator);
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