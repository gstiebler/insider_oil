var fiberTests = require('./lib/fiberTests');
var await = require(__dirname + '/../lib/await');

var port = 3333;
var InitializeServer = require('./lib/InitializeServer');

var request = require('request');

var group = {

first: function(test) {
    var server = InitializeServer(port);
    
    server.on('listening', function() {
        var loginParams = {
            username: 'gstiebler',
            password: 'guilherme'
        };

        request.post({url: 'http://localhost:' + port + '/login_rest', form: loginParams}, function (error, response, body) {
            if(error) {
                console.log(error);
            } else if (response.statusCode == 200) {
                console.log(body);
            }
            server.close();
            test.done();
        })
    });
}

};

fiberTests.convertTests( exports, group );