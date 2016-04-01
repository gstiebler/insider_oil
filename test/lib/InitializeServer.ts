var app  = require(__dirname + '/../../app');
var http = require('http');

module.exports = function(port) {
    app.set('port', port);
    var server = http.createServer(app);
    server.listen(port);
    server.on('error', onError);
    
    function onError(error) {
        console.log(error);
    }
    
    return server;
}