"use strict";
var fiberTests = require('./lib/fiberTests');
var Sync = require('sync');
var await = require(__dirname + '/../lib/await');

var port = 3333;
var InitializeServer = require('./lib/InitializeServer');

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;
    
var tableLoadTime = 1000;


function makeLogin(test, driver) {
    driver.get('http://localhost:' + port);
    test.equal('Login', await( driver.getTitle() ));
    driver.findElement(By.name('username')).sendKeys('gstiebler');
    driver.findElement(By.name('password')).sendKeys('guilherme');
    driver.findElement(By.id('buttonOk')).click();
    test.equal('Insider Oil', await( driver.getTitle() ));
}


function checkCompaniesComboBox(companiesComboBox, test) {
    var optionElements = await( companiesComboBox.findElements(By.xpath("option")) );
    test.equal( 7, optionElements.length );
    test.equal( "Petrobrás", await( optionElements[0].getText() ) );
    test.equal( "Eni Oil", await( optionElements[1].getText() ) );
    test.equal( "Paragon", await( optionElements[6].getText() ) );
}


function selectComboBoxItem(comboBox, itemName)
{
    comboBox.click();
    var optionElem = comboBox.findElement(elementByText(itemName));
    optionElem.click();
    comboBox.click();
}


function getFlashMessage(driver, index) {
    var elements = await( driver.findElements(By.xpath('//*[@id="flashMessage"]/div/span/span')) );
    var text = await( elements[index].getText() );
    return text;
}


function addWell(test, driver) {
    driver.findElement(elementByText('Adicionar')).click();
    driver.sleep(200);
    test.ok( await( driver.isElementPresent(elementByText('Poço:'))) );
    test.ok( await( driver.isElementPresent(elementByText('Operador:'))) );
    test.ok( await( driver.isElementPresent(elementByText('Longitude:'))) );
    test.ok( await( driver.isElementPresent(elementByText('Salvar'))) );
    
    // test adding well without name
    var companiesCombo = driver.findElement(By.id('html_id_operator_id'));
    checkCompaniesComboBox(companiesCombo, test);
    selectComboBoxItem(companiesCombo, 'Statoil');
    driver.findElement(By.id('html_id_state')).sendKeys('AC');
    driver.findElement(By.id('html_id_bacia')).sendKeys('Bacia do Selenium');
    driver.findElement(By.id('html_id_lat')).sendKeys('1234');
    driver.findElement(By.id('html_id_lng')).sendKeys('3334321');
    driver.findElement(elementByText('Salvar')).click();
    driver.sleep(200);
    test.equal( "Não foi possível criar o registro.", getFlashMessage(driver, 0) );
    test.equal( "Nome não pode ser nulo", getFlashMessage(driver, 1) );
    
    // test save correct well
    driver.findElement(By.id('html_id_name')).sendKeys('Novo poço Selenium');
    driver.findElement(elementByText('Salvar')).click();
    driver.sleep(tableLoadTime);
    test.equal( "Registro criado com sucesso.", getFlashMessage(driver, 0) );
    var a = elementByText('Mostrando de 1 até 4 de 4 registros');
    var b = driver.isElementPresent(a);
    test.ok( await( b ) );
    test.equal( 'Novo poço Selenium', getTableValue(3, 0, driver) );
    test.equal( 'Statoil', getTableValue(3, 1, driver) );
    test.equal( 'AC', getTableValue(3, 2, driver) );
    test.equal( 'Bacia do Selenium', getTableValue(3, 3, driver) );
}

function checkWells(test, driver) {
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
    driver.findElement(By.id('html_id_bacia')).clear();
    driver.findElement(By.id('html_id_bacia')).sendKeys('Bacia Elvis Foca');
    var companiesCombo = driver.findElement(By.id('html_id_operator_id'));
    checkCompaniesComboBox(companiesCombo, test);
    selectComboBoxItem(companiesCombo, 'Etesco');
    
    // test save well with error
    driver.findElement(By.id('html_id_name')).clear();
    driver.findElement(elementByText('Salvar')).click();
    driver.sleep(200);
    test.equal( "Não foi possível salvar o registro.", getFlashMessage(driver, 0) );
    test.equal( "Nome não pode ser nulo", getFlashMessage(driver, 1) );
    
    // test save correct well
    driver.findElement(By.id('html_id_name')).sendKeys('1AJ 0001 BA');
    driver.findElement(elementByText('Salvar')).click();
    driver.sleep(tableLoadTime);
    test.equal( "Registro salvo com sucesso.", getFlashMessage(driver, 0) );
    test.equal( '1AJ 0001 BA', getTableValue(2, 0, driver) );
    test.equal( 'Etesco', getTableValue(2, 1, driver) );
    test.equal( 'Bacia Elvis Foca', getTableValue(2, 3, driver) );
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
    test.equal( 'Statoil', getTableValue(0, 1, driver) );
    test.equal( 'Em operação', getTableValue(0, 3, driver) );
    test.equal( '2011-06-05T00:00:00.000Z', getTableValue(0, 5, driver) );
    test.equal( 'Paragon DPDS3', getTableValue(1, 0, driver) );
    test.equal( 'Schahin', getTableValue(1, 1, driver) );
    test.equal( 'Em operação', getTableValue(1, 3, driver) );
    test.equal( '2005-04-13T00:00:00.000Z', getTableValue(1, 5, driver) );
}

function uploadExcelFile(test, driver) {
    var fileName = __dirname + '\\data\\drilling_rigs.xls';
    driver.findElement(By.id('uploadExcelButton')).sendKeys(fileName);
    driver.sleep(tableLoadTime + 500);
    test.ok( await( driver.isElementPresent(elementByText('Mostrando de 1 até 10 de 13 registros'))) );
    test.equal( 'Aban Abraham', getTableValue(0, 0, driver) );
    test.equal( 'Etesco', getTableValue(0, 1, driver) );
    test.equal( 'Amazônia', getTableValue(1, 0, driver) );
    test.equal( 'Schahin', getTableValue(1, 1, driver) );
    test.equal( 'S.C. Lancer', getTableValue(8, 0, driver) );
    test.equal( 'Schahin', getTableValue(8, 1, driver) );
    test.equal( 'Schahin Cerrado', getTableValue(9, 0, driver) );
    test.equal( 'Schahin', getTableValue(9, 1, driver) );
}

function logout(test, driver) {
    driver.findElement(elementByText('Logout')).click();
    test.equal('Login', await( driver.getTitle() ));
}
    
var group = {

first: function(test) {
    var server = InitializeServer(port);
    
    var driver = new webdriver.Builder()
        .forBrowser('firefox')
        .build();
    
    makeLogin(test, driver);
    checkMainPage(test, driver);
    driver.findElement(elementByText('Poços')).click();
    driver.sleep(500);
    checkWells(test, driver);
    addWell(test, driver);
    editWell(test, driver);
    deleteWell(test, driver);
    logout(test, driver);
    
    server.close();
    driver.quit();
    test.done();
},

uploadExcelFiles: function(test) {
    var server = InitializeServer(port);
    
    var driver = new webdriver.Builder()
        .forBrowser('firefox')
        .build();
        
    makeLogin(test, driver);
    
    showDrillingRigs(test, driver);
    uploadExcelFile(test, driver);
    
    server.close();
    driver.quit();
    test.done();
},

mapAndChart: function(test) {
    var server = InitializeServer(port);
    
    var driver = new webdriver.Builder()
        .forBrowser('firefox')
        .build();
        
    makeLogin(test, driver);
    
    driver.get('http://localhost:' + port + '/app/map?model=Well');
    test.equal('Insider Oil', await( driver.getTitle() ));
    test.ok( await( driver.isElementPresent(By.xpath("id('map')/div/div/div"))) );
    
    driver.get('http://localhost:' + port + '/app/chart');
    test.equal('Insider Oil', await( driver.getTitle() ));
    test.ok( await( driver.isElementPresent(By.xpath("id('curve_chart')/div/div/div"))) );
    
    server.close();
    driver.quit();
    test.done();
},

arbitraryUrl: function(test) {
    var server = InitializeServer(port);
    
    var driver = new webdriver.Builder()
        .forBrowser('firefox')
        .build();
    
    driver.get('http://localhost:' + port + '/app/model_view?model=Well');
    test.equal('Insider Oil', await( driver.getTitle() ));
    test.ok( !await( driver.isElementPresent(elementByText('resultados por página'))) );
        
    makeLogin(test, driver);
    
    driver.get('http://localhost:' + port + '/app/model_view?model=Well');
    test.equal('Insider Oil', await( driver.getTitle() ));
    checkWells(test, driver);
    
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