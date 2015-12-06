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
    test.equal('Login', await( driver.getTitle() ));
    
    driver.findElement(webdriver.By.name('username')).sendKeys('gstiebler');
    driver.findElement(webdriver.By.name('password')).sendKeys('guilherme');
    driver.findElement(webdriver.By.id('buttonOk')).click();
    test.equal('Insider Oil', await( driver.getTitle() ));
    
    test.ok( isElementPresentSync(webdriver.By.id('navbar')) );
    test.ok( !isElementPresentSync(webdriver.By.id('foca')) );
    test.ok( !isElementPresentSync( elementByText('Focas') ) );
    test.ok( isElementPresentSync( elementByText('Poços') ) );
    test.ok( isElementPresentSync( elementByText('Sondas') ) );
    test.ok( isElementPresentSync( elementByText('gstiebler') ) );
    test.ok( isElementPresentSync( elementByText('Logout') ) );
    driver.findElement(elementByText('Poços')).click();
    sleep.sync(null, 500);
    test.ok( isElementPresentSync( elementByText('Mostrando de 1 até 3 de 3 registros') ) );
    driver.findElement(elementByText('Adicionar')).click();
    sleep.sync(null, 200);
    test.ok( isElementPresentSync( elementByText('Poço:') ) );
    test.ok( isElementPresentSync( elementByText('Operador:') ) );
    test.ok( isElementPresentSync( elementByText('Longitude') ) );
    test.ok( isElementPresentSync( elementByText('Salvar') ) );
    sleep.sync(null, 2000);
    
    server.close();
    driver.quit();
    test.done();
}

};

function sleep(ms, callback) {
    setTimeout(function() {
        callback();
    }, ms);
}

function elementByText(text) {
    var str = "//*[contains(text(), '" + text + "')]";
    return webdriver.By.xpath(str)
}

function isElementPresentSync(by) {
    return isElementPresent.sync(null, by);
}

function isElementPresent(by, callback) {
    driver.findElement(by).then(function(webElement) {
        callback(null, true);
    }, function(err) {
        if (err.state && err.state === 'no such element') {
            callback(null, false);
        } else {
            webdriver.promise.rejected(err);
            callback(null, false);
        }
    });
}

fiberTests.convertTests( exports, group );