var fiberTests = require('./lib/fiberTests');
var Sync = require('sync');
var await = require(__dirname + '/../lib/await');

var app  = require(__dirname + '/../app');
var http = require('http');
var port = 3333;

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;
    
var tableLoadTime = 1000;
    
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

function makeLogin(test, driver) {
    driver.findElement(By.name('username')).sendKeys('gstiebler');
    driver.findElement(By.name('password')).sendKeys('guilherme');
    driver.findElement(By.id('buttonOk')).click();
    test.equal('Insider Oil', await( driver.getTitle() ));
}

function addWell(test, driver) {
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
    driver.sleep(tableLoadTime);
    test.ok( await( driver.isElementPresent(elementByText('Mostrando de 1 até 4 de 4 registros'))) );
    test.equal( 'Novo poço Selenium', getTableValue(3, 0, driver) );
    test.equal( 'Operador Petrobrás', getTableValue(3, 1, driver) );
    test.equal( 'AC', getTableValue(3, 2, driver) );
    test.equal( 'Bacia do Selenium', getTableValue(3, 3, driver) );
}

function showWells(test, driver) {
    driver.findElement(elementByText('Poços')).click();
    driver.sleep(500);
    test.equal( '1A 0001 BA', getTableValue(0, 0, driver) );
    test.equal( 'Petrobrás', getTableValue(0, 1, driver) );
    test.equal( 'Recôncavo', getTableValue(0, 3, driver) );
    test.equal( '1AJ 0001 BA', getTableValue(2, 0, driver) );
    test.equal( 'Recôncavo E&P', getTableValue(2, 1, driver) );
    test.equal( 'Recôncavo', getTableValue(2, 3, driver) );
}

function checkMainPage(test, driver) {
    test.ok( await( driver.isElementPresent(By.id('navbar')) ) );
    test.ok( !await( driver.isElementPresent(By.id('foca')) ) );
    test.ok( !await( driver.isElementPresent(elementByText('Focas'))) );
    test.ok( await( driver.isElementPresent(elementByText('Sondas'))) );
    test.ok( await( driver.isElementPresent(elementByText('gstiebler'))) );
    test.ok( await( driver.isElementPresent(elementByText('Logout'))) );
}

function editWell(test, driver) {
    var editBtn = getTableCell(2, 4, driver).findElement(By.xpath("a"));
    editBtn.click();
    driver.sleep(200);
    driver.findElement(By.id('html_id_Operador')).clear();
    driver.findElement(By.id('html_id_Operador')).sendKeys('Operador Elvis Foca');
    driver.findElement(elementByText('Salvar')).click();
    driver.sleep(tableLoadTime);
    test.equal( '1AJ 0001 BA', getTableValue(2, 0, driver) );
    test.equal( 'Operador Elvis Foca', getTableValue(2, 1, driver) );
    test.equal( 'Recôncavo', getTableValue(2, 3, driver) );
}

function deleteWell(test, driver) {
    var deleteBtn = getTableCell(2, 5, driver).findElement(By.xpath("button"));
    deleteBtn.click();
    driver.switchTo().alert().accept();
    driver.sleep(tableLoadTime);
    test.ok( await( driver.isElementPresent(elementByText('Mostrando de 1 até 3 de 3 registros'))) );
    test.ok( !await( driver.isElementPresent(elementByText('Operador Elvis Foca'))) );
}

function showDrillingRigs(test, driver) {
    driver.findElement(elementByText('Sondas')).click();
    driver.sleep(500);
    test.equal( 'Aban Abraham', getTableValue(0, 0, driver) );
    test.equal( 'Etesco', getTableValue(0, 1, driver) );
    test.equal( 'Em operação', getTableValue(0, 3, driver) );
    test.equal( 'Paragon DPDS3', getTableValue(1, 0, driver) );
    test.equal( 'Paragon', getTableValue(1, 1, driver) );
    test.equal( 'Em operação', getTableValue(1, 3, driver) );
}

function uploadExcelFile(test, driver) {
    console.log('uploadExcelFile');
    var fileName = __dirname + '\\data\\drilling_rigs.xls';
    driver.findElement(By.id('uploadExcelButton')).sendKeys(fileName);
    driver.sleep(tableLoadTime);
    test.ok( await( driver.isElementPresent(elementByText('Mostrando de 1 até 10 de 98 registros'))) );
}

function logout(test, driver) {
    driver.findElement(elementByText('Logout')).click();
    test.equal('Login', await( driver.getTitle() ));
}
    
var group = {

first: function(test) {
    var server = setUpServer();
    
    var driver = new webdriver.Builder()
        .forBrowser('firefox')
        .build();
    
    driver.get('http://localhost:' + port);
    test.equal('Login', await( driver.getTitle() ));
    
    makeLogin(test, driver);
    checkMainPage(test, driver);
    showWells(test, driver);
    addWell(test, driver);
    editWell(test, driver);
    deleteWell(test, driver);
    logout(test, driver);
    
    server.close();
    driver.quit();
    test.done();
},

uploadExcelFiles: function(test) {
    var server = setUpServer();
    
    var driver = new webdriver.Builder()
        .forBrowser('firefox')
        .build();
    
    driver.get('http://localhost:' + port);
    test.equal('Login', await( driver.getTitle() ));
        
    makeLogin(test, driver);
    
    showDrillingRigs(test, driver);
    uploadExcelFile(test, driver);
    
    server.close();
    driver.quit();
    test.done();
}

};


function getTableRows(driver) {
    return await( driver.findElements(By.xpath("id('mainTable')/tbody/tr")) );
}


function getTableCell(row, columnn, driver) {
    var tds = await( getTableRows(driver)[row].findElements(By.xpath("td")) );
    return tds[columnn]
}


function getTableValue(row, columnn, driver) {
    var text = await( getTableCell(row, columnn, driver).getText() );
    return text;
}


function elementByText(text) {
    var str = "//*[contains(text(), '" + text + "')]";
    return By.xpath(str)
}


fiberTests.convertTests( exports, group );