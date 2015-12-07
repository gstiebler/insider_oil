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
}

};

fiberTests.convertTests( exports, group );