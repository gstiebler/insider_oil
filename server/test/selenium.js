var fiberTests = require('./lib/fiberTests');
var db = require('../db/models');
var await = require('../lib/await');
var app  = require(__dirname + '/../app.js');
var port = 3333;
var http = require('http');

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();
    
    
var group = {

first: function(test) {
    app.set('port', port);
    var server = http.createServer(app);
    server.listen(port);
    server.on('error', onError);
    
    function onError(error) {
        console.log(error);
    }
    
    driver.get('http://www.google.com/ncr');
    driver.findElement(By.name('q')).sendKeys('webdriver');
    driver.findElement(By.name('btnG')).click();
    driver.wait(until.titleIs('webdriver - Google Search'), 1000);
    driver.quit();
    
    server.close();
    test.done();
}

};

fiberTests.convertTests( exports, group );