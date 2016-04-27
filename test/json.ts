"use strict"

import fiberTests = require('./lib/fiberTests');
var Sync = require('sync');
import utils = require('./lib/utils');
import nodeunit = require('nodeunit');

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

var group:nodeunit.ITestGroup = {

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
        test.equal(16, json.fields.length);
        
        test.equal('name', json.fields[0].name);
        test.equal('Poço', json.fields[0].label);
        test.equal('VARCHAR(255)', json.fields[0].type);
        
        test.equal('lng', json.fields[3].name);
        test.equal('Longitude', json.fields[3].label);
        test.equal('DECIMAL(10,6)', json.fields[3].type);
        
        test.equal('operator_id', json.fields[14].name);
        test.equal('Operador', json.fields[14].label);
        test.equal('ref', json.fields[14].type);
        test.equal('Company', json.fields[14].model);
        
        server.close();
        test.done();
    }
},

recordValues: function(test) {
    var server = InitializeServer(port);
    const wellId = utils.idByName('Well', '1AGIP1RJS');
    const basinId = utils.idByName('Basin', 'Tucano Central');
    const operatorId = utils.idByName('Company', 'Eni Oil');
    const url = '/record_values?model=Well&id=' + wellId;
    getToken(function(token){
        getUrl(url, {}, token, onWellValues);
    });
    
    function onWellValues(json) {
        test.equal(16, json.fields.length);

        test.equal('1AGIP1RJS', json.values.name);
        test.equal(operatorId, json.values.operator_id);
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

exports.group = fiberTests.convertTests( group, true );