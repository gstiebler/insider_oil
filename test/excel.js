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
    
    function onImportDone(status) {
        var rows = await( dbUtils.findAllCustom(db.DrillingRig));
        test.equal( 98, rows.length );  
        var expectedStatus = "Registros criados: 95";
        expectedStatus += "\nRegistros atualizados: 3";
        test.equal( expectedStatus, status );
        
        test.equal(rows[0].name, "Aban");
        test.equal(rows[0].contractor.name, "Paragon");
        test.equal(rows[10].name, "Aban");
        test.equal(rows[10].contractor.name, "Paragon");
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