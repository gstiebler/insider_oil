"use strict";
var fiberTests = require('./lib/fiberTests');
var db = require('../db/models');
var await = require('../lib/await');
var fs = require('fs');
var importExcel = require('../lib/importExcel');
var ExportExcel = require('../lib/ExportExcel');
var XLSX = require('xlsx');
var dbUtils = require('../lib/dbUtils');

function onError(error) {
    console.error(error);
}

var group = {

importDrillingRigOffshore: function(test) {
    var fixtureCount = 3;
    test.equal( fixtureCount, await( db.DrillingRigOffshore.findAll() ).length );  
    var excelBuf = fs.readFileSync('./test/data/drilling_rigs.xls');
    try {
        importExcel(excelBuf, 'DrillingRigOffshore', onImportDone, onError);
    } catch(err) {
        console.log(err);
    }
    
    function onImportDone(status, invalidRecordsStatus) {
        var rows = await( dbUtils.findAllCustom(db.DrillingRigOffshore));
        test.equal( 26, rows.length );  
        var expectedStatus = "Registros criados: 23";
        expectedStatus += "\nRegistros atualizados: 3";
        expectedStatus += "\nRegistros inválidos: 72";
        test.equal( expectedStatus, status );
        test.equal( "Registro 5: Valor 'Brasdril' do campo 'contratada' não encontrado.", invalidRecordsStatus[0] );
        test.equal( "Registro 6: Valor 'Transocean' do campo 'contratada' não encontrado.", invalidRecordsStatus[1] );
        test.equal( "Registro 97: Valor 'Sete Brasil' do campo 'contratada' não encontrado.", invalidRecordsStatus[70] );
        test.equal( "Registro 98: Valor 'Sete Brasil' do campo 'contratada' não encontrado.", invalidRecordsStatus[71] );
        
        test.equal("Aban Abraham", rows[0].name);
        test.equal("Etesco", rows[0].contractor.name);
        test.equal("NS", rows[0].type);
        test.equal("Em operação", rows[0].status);
        test.equal(1900, rows[0].lda);
        test.equal("2011-06-05", rows[0].start.toJSON().substring(0, 10));
        test.equal("2016-06-02", rows[0].end.toJSON().substring(0, 10));
        test.equal("Petrobras XVII", rows[10].name);
        test.equal("Petrobrás", rows[10].contractor.name);
        test.equal("SS", rows[10].type);
        test.equal("Em operação", rows[10].status);
        test.equal(700, rows[10].lda);
        test.equal("0000-00-00", rows[10].start.substring(0, 10));
        test.equal("0000-00-00", rows[10].end.substring(0, 10));
        
        test.done();
    }
},


importAmbientalLicenses: test => {
    var fixtureCount = 3;
    test.equal( fixtureCount, await( db.AmbientalLicense.findAll() ).length );  
    var excelBuf = fs.readFileSync('./test/data/ambiental_licenses.xlsx');
    importExcel(excelBuf, 'AmbientalLicense', onImportDone, onError);
    
    function onImportDone(status, invalidRecordsStatus) {
        var rows = await( dbUtils.findAllCustom(db.AmbientalLicense));
        test.equal( 18, rows.length );  
        var expectedStatus = "Registros criados: 15";
        expectedStatus += "\nRegistros atualizados: 5";
        expectedStatus += "\nRegistros inválidos: 0";
        test.equal( expectedStatus, status );
        test.equal( 0, invalidRecordsStatus.length );
        
        test.equal('2015-01-09', rows[0].start.toJSON().substring(0, 10));
        test.equal('2016-01-09', rows[0].end.toJSON().substring(0, 10));
        test.equal('ABio 560/2014', rows[0].license);
        test.equal('Perfuração Marítima - Bloco BM-CAL-13 - Bacia de Camamu-Almada', rows[0].enterprise);
        test.equal('BP ENERGY DO BRASIL LTDA', rows[0].entrepreneur);
        test.equal('02022.001868/2007-89', rows[0].process);
        test.equal('Petróleo - Perfuração', rows[0].tipology);
        test.equal('Não', rows[0].pac);
        test.equal('2015-07-16', rows[9].start.toJSON().substring(0, 10));
        test.equal('0000-00-00', rows[9].end);
        test.equal('ABio 616/2015', rows[9].license);
        test.equal('Perfuração Marítima - Blocos BM-POT-16 e 17 - Bacia de Potiguar', rows[9].enterprise);
        test.equal('PETRÓLEO BRASILEIRO S/A - PETROBRÁS', rows[9].entrepreneur);
        test.equal('02022.004723/2006-59', rows[9].process);
        test.equal('Petróleo - Perfuração', rows[9].tipology);
        test.equal('Não', rows[9].pac);
        
        test.done();
    }
},


export: test => {
	const excelBuf = ExportExcel.main('Well');
    //const workbook = XLSX.read(excelBuf, {type:"buffer", cellDates: true});
    test.done();
},


invalidHeader: function(test) {
    var excelBuf = fs.readFileSync('./test/data/drilling_rigs.xls');
    var workbook = XLSX.read(excelBuf, {type:"buffer"});
    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];
    worksheet['B1'].v = 'teste';
    var modifiedExcelBuf = XLSX.write(workbook, {type:"buffer"});
    
    try {
        importExcel(modifiedExcelBuf, 'DrillingRigOffshore');
    } catch(err) {
        test.equal( "O cabeçalho do arquivo Excel não possui o campo sonda", err );
        test.done();
    }
}


};

fiberTests.convertTests( exports, group );