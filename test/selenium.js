var app  = require(__dirname + '/../app');
var http = require('http');
var port = 3333;

var fiberTests = require('./lib/fiberTests');
var Sync = require('sync');
var await = require(__dirname + '/../lib/await');

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();
    
function setUpServer() {
    app.set('port', port);
    var server = http.createServer(app);
    server.listen(port);
    server.on('error', onError);
    
    function onError(error) {
        console.log(error);
    }
    
    return server;
}
    
var group = {

first: function(test) {
    var server = setUpServer();
    
    driver.get('http://localhost:' + port);
    var title = await( driver.getTitle() );
    console.log('title: ' + title);
    test.equal('Login', title);
    server.close();
    driver.quit();
    test.done();
}

};

fiberTests.convertTests( exports, group );