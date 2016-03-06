"use strict";
var fiberTests = require('./lib/fiberTests');
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
    var optionElements = await( companiesCombo.findElements(By.xpath("option")) );
    test.equal( 8, optionElements.length );
    test.equal( "", await( optionElements[0].getText() ) );
    test.equal( "Petrobrás", await( optionElements[1].getText() ) );
    test.equal( "Eni Oil", await( optionElements[2].getText() ) );
    test.equal( "Paragon", await( optionElements[7].getText() ) );
    
    selectComboBoxItem(companiesCombo, 'Statoil');
    driver.findElement(By.id('html_id_state')).sendKeys('AC');
    selectComboBoxItem(driver.findElement(By.id('html_id_basin_id')), 'Potiguar');
    selectComboBoxItem(driver.findElement(By.id('html_id_block_id')), 'ES-M-529');
    driver.findElement(By.id('html_id_lat')).sendKeys('1234');
    driver.findElement(By.id('html_id_lng')).sendKeys('3334321');
    driver.findElement(elementByText('Salvar')).click();
    driver.sleep(200);
    test.equal( "Não foi possível criar o registro.", getFlashMessage(driver, 0) );
    test.equal( "Nome não pode ser nulo", getFlashMessage(driver, 2) );
    
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
    test.equal( 'Potiguar', getTableValue(3, 3, driver) );
}

function checkWells(test, driver) {
    test.equal( '1A 0001 BA', getTableValue(0, 0, driver) );
    test.equal( 'Petrobrás', getTableValue(0, 1, driver) );
    test.equal( 'Potiguar', getTableValue(0, 3, driver) );
    test.equal( '1AJ 0001 BA', getTableValue(2, 0, driver) );
    test.equal( 'Recôncavo E&P', getTableValue(2, 1, driver) );
    test.equal( 'Recôncavo', getTableValue(2, 3, driver) );
}

function checkMainPage(test, driver) {
    test.ok( await( driver.isElementPresent(By.id('navbar')) ) );
    test.ok( !await( driver.isElementPresent(By.id('foca')) ) );
    test.ok( !await( driver.isElementPresent(elementByText('Focas'))) );
    test.ok( await( driver.isElementPresent(elementByText('Admin'))) );
    test.ok( await( driver.isElementPresent(elementByText('Árvore'))) );
    test.ok( await( driver.isElementPresent(elementByText('gstiebler'))) );
    test.ok( await( driver.isElementPresent(elementByText('Logout'))) );
}

function editWell(test, driver) {
    var editBtn = getTableCell(2, 4, driver).findElement(By.xpath("a"));
    editBtn.click();
    driver.sleep(200);
    driver.findElement(By.id('html_id_name')).clear();
    selectComboBoxItem(driver.findElement(By.id('html_id_basin_id')), 'Potiguar');
    var companiesCombo = driver.findElement(By.id('html_id_operator_id'));
    var optionElements = await( companiesCombo.findElements(By.xpath("option")) );
    test.equal( 7, optionElements.length );
    test.equal( "Petrobrás", await( optionElements[0].getText() ) );
    test.equal( "Eni Oil", await( optionElements[1].getText() ) );
    test.equal( "Paragon", await( optionElements[6].getText() ) );
    
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
    test.equal( 'Potiguar', getTableValue(2, 3, driver) );
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
    driver.findElement(elementByText('Admin')).click();
    driver.sleep(100);
    driver.findElement(elementByText('Sondas offshore')).click();
    driver.sleep(500);
    test.equal( 'Aban Abraham', getTableValue(0, 0, driver) );
    test.equal( 'Statoil', getTableValue(0, 1, driver) );
    test.equal( 'Em operação', getTableValue(0, 3, driver) );
    test.equal( '05/06/2011', getTableValue(0, 5, driver) );
    test.equal( 'Paragon DPDS3', getTableValue(1, 0, driver) );
    test.equal( 'Schahin', getTableValue(1, 1, driver) );
    test.equal( 'Em operação', getTableValue(1, 3, driver) );
    test.equal( '13/04/2005', getTableValue(1, 5, driver) );
}

function uploadExcelFile(test, driver) {
    var fileName = __dirname + '\\data\\drilling_rigs.xls';
    driver.findElement(By.id('uploadExcelButton')).sendKeys(fileName);
    driver.sleep(tableLoadTime + 500);
    test.equal( "Registros criados: 23", getFlashMessage(driver, 0) );
    test.equal( "Registros atualizados: 3", getFlashMessage(driver, 1) );
    test.equal( "Registros inválidos: 72", getFlashMessage(driver, 2) );
    test.equal( 'Mostrando de 1 até 10 de 26 registros', await( driver.findElement(By.xpath('//*[@id="mainTable_info"]')).getText() ));
    test.equal( 'Aban Abraham', getTableValue(0, 0, driver) );
    test.equal( 'Etesco', getTableValue(0, 1, driver) );
    test.equal( '05/06/2011', getTableValue(0, 5, driver) );
    test.equal( '02/06/2016', getTableValue(0, 6, driver) );
    test.equal( 'Amazônia', getTableValue(1, 0, driver) );
    test.equal( 'Schahin', getTableValue(1, 1, driver) );
    test.equal( '10/02/2012', getTableValue(1, 5, driver) );
    test.equal( '07/02/2017', getTableValue(1, 6, driver) );
    test.equal( 'Petrobras 09', getTableValue(8, 0, driver) );
    test.equal( 'Petrobrás', getTableValue(8, 1, driver) );
    test.equal( '00/00/0000', getTableValue(8, 5, driver) );
    test.equal( '00/00/0000', getTableValue(8, 6, driver) );
    test.equal( 'Petrobras 59', getTableValue(9, 0, driver) );
    test.equal( 'Petrobrás', getTableValue(9, 1, driver) )
    test.equal( '00/00/0000', getTableValue(9, 5, driver) );
    test.equal( '00/00/0000', getTableValue(9, 6, driver) );;
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
    driver.findElement(elementByText('Admin')).click();
    driver.sleep(100);
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


loginError: function(test) {
    var server = InitializeServer(port);
    
    var driver = new webdriver.Builder()
        .forBrowser('firefox')
        .build();
    
    // test invalid user
    driver.get('http://localhost:' + port);
    test.equal('Login', await( driver.getTitle() ));
    driver.findElement(By.name('username')).sendKeys('asdfasf');
    driver.findElement(By.name('password')).sendKeys('asdfasdf');
    driver.findElement(By.id('buttonOk')).click();
    var alertElem = await( driver.findElement(By.xpath("/html/body/div/div")) );
    test.equal( 'Usuário não existe', await( alertElem.getText() ) );
    
    //test invalid password
    test.equal('Login', await( driver.getTitle() ));
    driver.findElement(By.name('username')).sendKeys('gstiebler');
    driver.findElement(By.name('password')).sendKeys('asdfasdf');
    driver.findElement(By.id('buttonOk')).click();
    var alertElem = await( driver.findElement(By.xpath("/html/body/div/div")) );
    test.equal( 'A senha está incorreta', await( alertElem.getText() ) );
    
    // test login ok
    test.equal('Login', await( driver.getTitle() ));
    driver.findElement(By.name('username')).sendKeys('gstiebler');
    driver.findElement(By.name('password')).sendKeys('guilherme');
    driver.findElement(By.id('buttonOk')).click();
    test.equal('Insider Oil', await( driver.getTitle() ));
    
    server.close();
    driver.quit();
    test.done();  
},


editDrillingRig: function(test) {
    var server = InitializeServer(port);
    
    var driver = new webdriver.Builder()
        .forBrowser('firefox')
        .build();
    
    makeLogin(test, driver);
    test.equal('Insider Oil', await( driver.getTitle() ));
    driver.findElement(elementByText('Admin')).click();
    driver.sleep(100);
    driver.findElement(elementByText('Sondas offshore')).click();
    driver.findElement(elementByText('Adicionar')).click();
    driver.sleep(200);
    driver.findElement(By.id('html_id_name')).sendKeys('nova sonda');
    driver.findElement(By.id('html_id_type')).sendKeys('novo tipo');
    driver.findElement(By.id('html_id_status')).sendKeys('novo status');
    driver.findElement(By.id('html_id_lda')).sendKeys('333');
    driver.findElement(By.id('html_id_start')).sendKeys('25/12/2015');
    driver.findElement(By.id('html_id_end')).sendKeys('26/12/2015');
    var contractorCombo = driver.findElement(By.id('html_id_contractor_id'));
    selectComboBoxItem(contractorCombo, 'Etesco');
    driver.findElement(elementByText('Salvar')).click();
    driver.sleep(tableLoadTime);
    
    test.equal( 'nova sonda', getTableValue(1, 0, driver) );
    test.equal( '25/12/2015', getTableValue(1, 5, driver) );
    test.equal( '26/12/2015', getTableValue(1, 6, driver) );
    
    var editBtn = getTableCell(1, 7, driver).findElement(By.xpath("a"));
    editBtn.click();
    driver.sleep(200);
    driver.findElement(By.id('html_id_start')).clear();
    driver.findElement(By.id('html_id_start')).sendKeys('24/12/2015');
    driver.findElement(elementByText('Salvar')).click();
    driver.sleep(tableLoadTime);
    test.equal( '24/12/2015', getTableValue(1, 5, driver) );
    
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
},


testDates: function(test) {
    var server = InitializeServer(port);
    
    var driver = new webdriver.Builder()
        .forBrowser('firefox')
        .build();
    
    makeLogin(test, driver);
    driver.get('http://localhost:' + port + '/app/model_view?model=DrillingRigOffshore');
    test.equal('Insider Oil', await( driver.getTitle() ));
    
    test.equal( 'Aban Abraham', getTableValue(0, 0, driver) );
    test.equal( 'Paragon DPDS3', getTableValue(1, 0, driver) );
    test.equal( 'S.C. Lancer', getTableValue(2, 0, driver) );
    
    test.equal( '05/06/2011', getTableValue(0, 5, driver) );
    test.equal( '13/04/2005', getTableValue(1, 5, driver) );
    test.equal( '16/08/2002', getTableValue(2, 5, driver) );
    
    test.equal( '02/06/2016', getTableValue(0, 6, driver) );
    test.equal( '10/03/2016', getTableValue(1, 6, driver) );
    test.equal( '11/08/2016', getTableValue(2, 6, driver) );
    
    // click order by start
    driver.findElement(By.xpath('//*[@id="mainTable"]/thead/tr/th[6]')).click();
    
    test.equal( 'S.C. Lancer', getTableValue(0, 0, driver) );
    test.equal( 'Paragon DPDS3', getTableValue(1, 0, driver) );
    test.equal( 'Aban Abraham', getTableValue(2, 0, driver) );
    
    test.equal( '16/08/2002', getTableValue(0, 5, driver) );
    test.equal( '13/04/2005', getTableValue(1, 5, driver) );
    test.equal( '05/06/2011', getTableValue(2, 5, driver) );
    
    test.equal( '11/08/2016', getTableValue(0, 6, driver) );
    test.equal( '10/03/2016', getTableValue(1, 6, driver) );
    test.equal( '02/06/2016', getTableValue(2, 6, driver) );
    
    // click order by start desc
    driver.findElement(By.xpath('//*[@id="mainTable"]/thead/tr/th[6]')).click();
    
    test.equal( 'Aban Abraham', getTableValue(0, 0, driver) );
    test.equal( 'Paragon DPDS3', getTableValue(1, 0, driver) );
    test.equal( 'S.C. Lancer', getTableValue(2, 0, driver) );
    
    test.equal( '05/06/2011', getTableValue(0, 5, driver) );
    test.equal( '13/04/2005', getTableValue(1, 5, driver) );
    test.equal( '16/08/2002', getTableValue(2, 5, driver) );
    
    test.equal( '02/06/2016', getTableValue(0, 6, driver) );
    test.equal( '10/03/2016', getTableValue(1, 6, driver) );
    test.equal( '11/08/2016', getTableValue(2, 6, driver) );  
    
    // click order by end
    driver.findElement(By.xpath('//*[@id="mainTable"]/thead/tr/th[7]')).click();
    test.equal( 'Paragon DPDS3', getTableValue(0, 0, driver) );
    test.equal( 'Aban Abraham', getTableValue(1, 0, driver) );
    test.equal( 'S.C. Lancer', getTableValue(2, 0, driver) );
    
    test.equal( '13/04/2005', getTableValue(0, 5, driver) );
    test.equal( '05/06/2011', getTableValue(1, 5, driver) );
    test.equal( '16/08/2002', getTableValue(2, 5, driver) );
    
    test.equal( '10/03/2016', getTableValue(0, 6, driver) );
    test.equal( '02/06/2016', getTableValue(1, 6, driver) );
    test.equal( '11/08/2016', getTableValue(2, 6, driver) ); 
    
    server.close();
    driver.quit();
    test.done();
},


tree: function(test) {
    var server = InitializeServer(port);
    
    var driver = new webdriver.Builder()
        .forBrowser('firefox')
        .build();
        
    makeLogin(test, driver);
    driver.findElement(elementByText('Árvore')).click();
    test.equal('Insider Oil', await( driver.getTitle() ));
    var treeItems = await( driver.findElements(By.xpath('//*[@id="angularContainer"]/p')) );
    test.equal( 3, treeItems.length );
    test.equal( "Exploração", await( treeItems[0].getText() ) );
    test.equal( "Produção", await( treeItems[1].getText() ) );
    //test.equal( "Logística", await( treeItems[2].getText() ) );
    //test.equal( "Downstream", await( treeItems[3].getText() ) );
    test.equal( "Oil & Gas", await( driver.findElement(By.xpath('//*[@id="angularContainer"]/span/a')).getText() ));
    driver.findElement(elementByText('Produção')).click();
    driver.sleep(100);
    driver.findElement(elementByText('Onshore')).click();
    driver.sleep(100);
    driver.findElement(elementByText('Campos em fase de desenvolvimento')).click();
    driver.sleep(100);
    test.equal( "Oil & Gas", await( driver.findElement(By.xpath('//*[@id="angularContainer"]/span[1]/a')).getText() ));
    test.equal( "Produção", await( driver.findElement(By.xpath('//*[@id="angularContainer"]/span[2]/a')).getText() ));
    test.equal( "Onshore", await( driver.findElement(By.xpath('//*[@id="angularContainer"]/span[3]/a')).getText() ));
    test.equal( "Campos em fase de desenvolvimento", await( driver.findElement(By.xpath('//*[@id="angularContainer"]/span[4]/a')).getText() ));
    treeItems = await( driver.findElements(By.xpath('//*[@id="angularContainer"]/p')) );
    test.equal( "Arapaçu", await( treeItems[0].getText() ) );
    test.equal( "Azulão", await( treeItems[1].getText() ) );
    // clicking on the tree guide
    driver.findElement(elementByText('Onshore')).click();
    driver.sleep(100);
    treeItems = await( driver.findElements(By.xpath('//*[@id="angularContainer"]/p')) );
    test.equal( "Campos em fase de desenvolvimento", await( treeItems[0].getText() ) );
    test.equal( "Campos em fase de produção", await( treeItems[1].getText() ) );
    driver.findElement(elementByText('Campos em fase de produção')).click();
    driver.sleep(100);
    treeItems = await( driver.findElements(By.xpath('//*[@id="angularContainer"]/p')) );
    test.equal( "Anambé", await( treeItems[0].getText() ) );
    test.equal( "Jiribatuba2", await( treeItems[1].getText() ) );
    // selecting an element and showing the values of the record
    driver.findElement(elementByText('Jiribatuba2')).click();
    driver.sleep(100);
    /*test.equal( 'Nome:', await( driver.findElement(By.xpath('//*[@id="angularContainer"]/table/tbody/tr[1]/td[1]/span')).getText() ));
    test.equal( 'Jiribatuba2', await( driver.findElement(By.xpath('//*[@id="angularContainer"]/table/tbody/tr[1]/td[2]/div/span')).getText() ));
    test.equal( 'Terra/Mar:', await( driver.findElement(By.xpath('//*[@id="angularContainer"]/table/tbody/tr[4]/td[1]/span')).getText() ));
    test.equal( 'Terra', await( driver.findElement(By.xpath('//*[@id="angularContainer"]/table/tbody/tr[4]/td[2]/div/span')).getText() ));
    */
    server.close();
    driver.quit();
    test.done();
},


search: (test) => {
    var server = InitializeServer(port);
    
    var driver = new webdriver.Builder()
        .forBrowser('firefox')
        .build();

    makeLogin(test, driver);
    driver.findElement(By.xpath('//*[@id="searchBox"]/autocomplete/div/input')).sendKeys('ba');
    driver.sleep(200);
    driver.findElement(By.xpath('//*[@id="searchBox"]/autocomplete/div/ul/li[1]')).click();
    driver.sleep(200);

    /*test.equal( 'Nome:', await( driver.findElement(By.xpath('//*[@id="angularContainer"]/p[1]/span[1]')).getText() ) );
    test.equal( 'BM-BAR-1', await( driver.findElement(By.xpath('//*[@id="angularContainer"]/p[1]/span[2]')).getText() ) );
    test.equal( 'Concessionários:', await( driver.findElement(By.xpath('//*[@id="angularContainer"]/p[9]/span[1]')).getText() ) );
    test.equal( '*Petrobras - 75%, ONGC Campos - 25%', await( driver.findElement(By.xpath('//*[@id="angularContainer"]/p[9]/span[2]')).getText() ) );
    */
    
    server.close();
    driver.quit();
    test.done();
},


editPerson: (test) => {
    var server = InitializeServer(port);
    
    var driver = new webdriver.Builder()
        .forBrowser('firefox')
        .build();

    makeLogin(test, driver);
    driver.findElement(elementByText('Admin')).click();
    driver.sleep(150);
    driver.findElement(elementByText('Pessoas')).click();
    driver.sleep(150);
    var editBtn = getTableCell(1, 2, driver).findElement(By.xpath("a"));
    editBtn.click();
    driver.sleep(150);
    driver.findElement(By.xpath('//*[@id="add_button"]')).click(); // add button   
    const secondTelephoneXPath = '//*[@id="html_id_telephones"]/table/tbody/tr/td[1]/table/tbody/tr[2]/td[1]/input';  
    driver.findElement(By.xpath(secondTelephoneXPath)).sendKeys('21 333-444');
    const searchBoxXPath = '//*[@id="html_id_projects"]/table/tbody/tr/td[2]/project-search/autocomplete/div';
    driver.findElement(By.xpath(searchBoxXPath + '/input')).sendKeys('');
    driver.sleep(1000);
    driver.findElement(By.xpath(searchBoxXPath + '/input')).sendKeys('jiri');
    driver.sleep(200);
    // click on first result of the search
    driver.findElement(By.xpath(searchBoxXPath + '/ul/li[1]')).click();
    // Remove first project
    driver.findElement(By.xpath('//*[@id="html_id_projects"]/table/tbody/tr/td[1]/table/tbody/tr[1]/td[2]/button')).click(); 
    driver.sleep(100);
    driver.findElement(elementByText('Salvar')).click();  
    driver.sleep(150);
    editBtn = getTableCell(1, 2, driver).findElement(By.xpath("a"));
    editBtn.click();
    driver.sleep(150);
    const element = driver.findElement(By.xpath(secondTelephoneXPath));
    const tel = await( element.getAttribute("value") );
    test.equal( '21 333-444', tel );
    const firstProjectText = await( driver.findElement(By.xpath('//*[@id="html_id_projects"]/table/tbody/tr/td[1]/table/tbody/tr/td[1]')).getText() );
    test.equal( 'Jiribatuba2', firstProjectText);
    
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