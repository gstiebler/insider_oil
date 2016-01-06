var fiberTests = require('./lib/fiberTests');
var await = require(__dirname + '/../lib/await');
var Sync = require('sync');

var port = 3333;
var InitializeServer = require('./lib/InitializeServer');

var request = require('request');

function getUrl(url, params, token, callback) {
     params.token = token;
    
    request({url: 'http://localhost:' + port + url, form: params}, function (error, response, body) {
        if(error) {
            console.log('error: ', error);
        } else if (response.statusCode == 200) {
            const json = JSON.parse(body);
            callback(json);
        }
    }); 
}

function postUrl(url, params, token, callback) {
    params.token = token;
    console.log(params);
    request.post({url: 'http://localhost:' + port + url, form: {params: params} }, function (error, response, body) {
        if(error) {
            console.log('error: ', error);
        } else if (response.statusCode == 200) {
            const json = JSON.parse(body);
            callback(json);
        }
    }); 
}

function getToken(callback) {
     var loginParams = {
        username: 'gstiebler',
        password: 'guilherme'
    };

    request.post({url: 'http://localhost:' + port + '/login_rest', form: loginParams}, function (error, response, body) {
        if(error) {
            console.log('error: ', error);
        } else if (response.statusCode == 200) {
            const json = JSON.parse(body);
            callback(json.token);
        }
    });   
}

var group = {

first: function(test) {
    var server = InitializeServer(port);
    
    getToken(function(token){
        getUrl('/db_server?table=Well', {}, token, onWells);
    });
    
    function onWells(json) {
        test.equal(3, json.records.length);
        test.equal('1A 0001 BA', json.records[0].name);
        
        server.close();
        test.done();
    }
},

modelFields: function(test) {
    var server = InitializeServer(port);
    
    getToken(function(token){
        getUrl('/model_fields?model=Well', {}, token, onWellFields);
    });
    
    function onWellFields(json) {
        test.equal(6, json.fields.length);
        
        test.equal('name', json.fields[0].name);
        test.equal('state', json.fields[1].name);
        test.equal('lng', json.fields[4].name);
        test.equal('operator_id', json.fields[5].name);
        
        test.equal('Poço', json.fields[0].label);
        test.equal('Estado', json.fields[1].label);
        test.equal('Longitude', json.fields[4].label);
        test.equal('Operador', json.fields[5].label);
        
        test.equal('VARCHAR(255)', json.fields[0].type);
        test.equal('VARCHAR(255)', json.fields[1].type);
        test.equal('DECIMAL(10,6)', json.fields[4].type);
        test.equal('ref', json.fields[5].type);
        
        test.equal('Company', json.fields[5].model);
        
        server.close();
        test.done();
    }
},

recordValues: function(test) {
    var server = InitializeServer(port);
    
    getToken(function(token){
        getUrl('/record_values?model=Well&id=2', {}, token, onWellValues);
    });
    
    function onWellValues(json) {
        test.equal(6, json.fields.length);
        
        test.equal('1AGIP1RJS', json.values.name);
        test.equal(2, json.values.operator_id);
        test.equal('RJ', json.values.state);
        test.equal('Santos', json.values.bacia);
        test.equal(-4.918086, json.values.lat);
        test.equal(-37.224645, json.values.lng);
        
        server.close();
        test.done();
    }
}/*,

createItem: function(test) {
    var server = InitializeServer(port);
    
    const params = {
        model: 'Well',
        newItemData: {
            name: 'Novo poço',
            operator: 'Novo operador',
            state: 'AC',
            bacia: 'Bacia nova',
            lat: 333,
            lng: 444
        }
    };
    
    getToken(function(token){
        postUrl('/create_item', params, token, onItemCreated);
    });
    
    function onItemCreated(json) {
        console.log(json);
        
        server.close();
        test.done();
    }
},

editItem: function(test) {
    var server = InitializeServer(port);
    
    getToken(function(token){
        getUrl('/record_values?model=Well&id=2', {}, token, itemEdited);
    });
    
    function itemEdited(json) {
        console.log(json);
        
        server.close();
        test.done();
    }
},

deleteItem: function(test) {
    var server = InitializeServer(port);
    
    getToken(function(token){
        getUrl('/record_values?model=Well&id=2', {}, token, onItemDeleted);
    });
    
    function onItemDeleted(json) {
        console.log(json);
        
        server.close();
        test.done();
    }
}*/

};

fiberTests.convertTests( exports, group );