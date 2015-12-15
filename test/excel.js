"use strict";
var fiberTests = require('./lib/fiberTests');
var db = require('../db/models');
var await = require('../lib/await');
var fs = require('fs');
var importExcel = require('../lib/importExcel');
var XLSX = require('xlsx');

function onError(error) {
    console.error(error.stack);
}

var group = {

first: function(test) {
    var fixtureCount = 3;
    test.equal( fixtureCount, await( db.DrillingRig.findAndCountAll() ).count );  
    var excelBuf = fs.readFileSync('./test/data/drilling_rigs.xls');
    try {
        importExcel(excelBuf, 'DrillingRig', onImportDone, onError);
    } catch(err) {
        console.log(err);
    }
    
    function onImportDone(status) {
        test.equal( 98, await( db.DrillingRig.findAndCountAll() ).count );  
        var expectedStatus = "Registros criados: 95";
        expectedStatus += "\nRegistros atualizados: 3";
        test.equal( expectedStatus, status );
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