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
    
    // login
    driver.findElement(By.name('username')).sendKeys('gstiebler');
    driver.findElement(By.name('password')).sendKeys('guilherme');
    driver.findElement(By.id('buttonOk')).click();
    test.equal('Insider Oil', await( driver.getTitle() ));
    
    //basic check on main page
    test.ok( await( driver.isElementPresent(By.id('navbar')) ) );
    test.ok( !await( driver.isElementPresent(By.id('foca')) ) );
    test.ok( !await( driver.isElementPresent(elementByText('Focas'))) );
    test.ok( await( driver.isElementPresent(elementByText('Sondas'))) );
    test.ok( await( driver.isElementPresent(elementByText('gstiebler'))) );
    test.ok( await( driver.isElementPresent(elementByText('Logout'))) );
    
    //show wells
    driver.findElement(elementByText('Poços')).click();
    driver.sleep(500);
    test.ok( await( driver.isElementPresent(elementByText('Mostrando de 1 até 3 de 3 registros'))) );
    //var trs = await( driver.findDomElement(By.xpath("id('mainTable')/tbody/tr[0]/td")) );
    //console.log('trs: ', trs);
    
    // add well
    driver.findElement(elementByText('Adicionar')).click();
    driver.sleep(200);
    test.ok( await( driver.isElementPresent(elementByText('Poço:'))) );
    test.ok( await( driver.isElementPresent(elementByText('Operador:'))) );
    test.ok( await( driver.isElementPresent(elementByText('Longitude:'))) );
    test.ok( await( driver.isElementPresent(elementByText('Salvar'))) );
    driver.findElement(By.id('html_id_Poço')).sendKeys('Novo poço Selenium');
    driver.findElement(By.id('html_id_Operador')).sendKeys('Operador Petrobrás');
    driver.findElement(By.id('html_id_Estado')).sendKeys('AC');
    driver.findElement(By.id('html_id_Bacia')).sendKeys('Bacia do Selenium');
    driver.findElement(By.id('html_id_Latitude')).sendKeys('1234');
    driver.findElement(By.id('html_id_Longitude')).sendKeys('3334321');
    driver.findElement(elementByText('Salvar')).click();
    driver.sleep(800);
    test.ok( await( driver.isElementPresent(elementByText('Mostrando de 1 até 4 de 4 registros'))) );
    
    // logout
    driver.findElement(elementByText('Logout')).click();
    test.equal('Login', await( driver.getTitle() ));
    
    
    server.close();
    driver.quit();
    test.done();
}

};

function elementByText(text) {
    var str = "//*[contains(text(), '" + text + "')]";
    return By.xpath(str)
}


fiberTests.convertTests( exports, group );