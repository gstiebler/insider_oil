"use strict";
var fiberTests = require('./lib/fiberTests');
var db = require('../db/models');
var await = require('../lib/await');
var fs = require('fs');
var importExcel = require('../lib/importExcel');
var XLSX = require('xlsx');
var dbUtils = require('../lib/dbUtils');

function onError(error) {
    console.error(error.stack);
}

var group = {

first: function(test) {
    var fixtureCount = 3;
    test.equal( fixtureCount, await( db.DrillingRig.findAll() ).length );  
    var excelBuf = fs.readFileSync('./test/data/drilling_rigs.xls');
    try {
        importExcel(excelBuf, 'DrillingRig', onImportDone, onError);
    } catch(err) {
        console.log(err);
    }
    
    function onImportDone(status, invalidRecordsStatus) {
        var rows = await( dbUtils.findAllCustom(db.DrillingRig));
        test.equal( 13, rows.length );  
        var expectedStatus = "Registros criados: 10";
        expectedStatus += "\nRegistros atualizados: 3";
        expectedStatus += "\nRegistros inválidos: 85";
        test.equal( expectedStatus, status );
        test.equal( "Valor 'Brasdril' do campo 'contratada' não encontrado.", invalidRecordsStatus[0] );
        test.equal( "Valor 'Transocean' do campo 'contratada' não encontrado.", invalidRecordsStatus[1] );
        test.equal( "Valor 'Sete Brasil' do campo 'contratada' não encontrado.", invalidRecordsStatus[83] );
        test.equal( "Valor 'Sete Brasil' do campo 'contratada' não encontrado.", invalidRecordsStatus[84] );
        
        test.equal(rows[0].name, "Aban Abraham");
        test.equal(rows[0].contractor.name, "Etesco");
        test.equal(rows[10].name, "Pantanal (Schahin I)");
        test.equal(rows[10].contractor.name, "Schahin");
        
        test.done();
    }
},


invalidHeader: function(test) {
    var excelBuf = fs.readFileSync('./test/data/drilling_rigs.xls');
    var workbook = XLSX.read(excelBuf, {type:"buffer"});
    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];
    worksheet['B1'].v = 'teste';
    var modifiedExcelBuf = XLSX.write(workbook, {type:"buffer"});
    
    try {
        importExcel(modifiedExcelBuf, 'DrillingRig');
    } catch(err) {
        test.equal( "O cabeçalho do arquivo Excel não possui o campo sonda", err );
        test.done();
    }
}


};

fiberTests.convertTests( exports, group );