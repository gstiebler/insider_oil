"use strict"

import fiberTests = require('./lib/fiberTests');
import db = require('../db/models');
import fs = require('fs');
import importExcel = require('../lib/excel/importExcel');
import ExportExcel = require('../lib/excel/ExportExcel');
var XLSX = require('xlsx');
import dbUtils = require('../lib/dbUtils');
var await = require('../lib/await');
import nodeunit = require('nodeunit');

function onError(error) {
    console.error(error.stack);
}

function compareArray(test, array1, array2) {
    test.equal(array1.length, array2.length);
    for(var i = 0; i < array1.length; i++)
        test.equal( array1[i], array2[i] );
}


var group: nodeunit.ITestGroup = {

importDrillingRigOffshore: function(test: nodeunit.Test) {
    var fixtureCount = 3;
    test.equal( fixtureCount, await( db.models.DrillingRigOffshore.findAll() ).length );  
    var excelBuf = fs.readFileSync('./test/data/drilling_rigs.xls');
    try {
        importExcel(excelBuf, 'DrillingRigOffshore', onImportDone, onError);
    } catch(err) {
        console.log(err);
    }
    
    function onImportDone(status, invalidRecordsStatus) {
        const DrillingRigOffshoreModel: dbUtils.ioDataSource = db.models.DrillingRigOffshore;
        var rows = await( dbUtils.findAllCustom(DrillingRigOffshoreModel));
        test.equal( 35, rows.length );  
        var expectedStatus = "Registros criados: 32";
        expectedStatus += "\nRegistros atualizados: 3";
        expectedStatus += "\nRegistros inválidos: 63";
        test.equal( expectedStatus, status );
        test.equal( "Registro 5: Valor 'Brasdril' do campo 'contratada' não encontrado.", invalidRecordsStatus[0] );
        test.equal( "Registro 6: Valor 'Transocean' do campo 'contratada' não encontrado.", invalidRecordsStatus[1] );
        test.equal( "Registro 97: Valor 'Sete Brasil' do campo 'contratada' não encontrado.", invalidRecordsStatus[61] );
        test.equal( "Registro 98: Valor 'Sete Brasil' do campo 'contratada' não encontrado.", invalidRecordsStatus[62] );
        
        test.equal("Aban Abraham", rows[0].name);
        test.equal("Etesco", rows[0].contractor.name);
        test.equal("NS", rows[0].type);
        test.equal("Em operação", rows[0].status);
        test.equal(1900, rows[0].lda);
        test.equal("2011-06-05", rows[0].start.toJSON().substring(0, 10));
        test.equal("2016-06-02", rows[0].end.toJSON().substring(0, 10));
        
        test.equal("Petrobras X", rows[10].name);
        test.equal("Petrobras", rows[10].contractor.name);
        test.equal("SS", rows[10].type);
        test.equal("Em operação", rows[10].status);
        test.equal(1500, rows[10].lda);
        test.equal(null, rows[10].start);
        test.equal(null, rows[10].end);
        
        test.done();
    }
},

/*
importAmbientalLicenses: (test: nodeunit.Test) => {
    var fixtureCount = 3;
    test.equal( fixtureCount, await( db.models.AmbientalLicense.findAll() ).length );  
    var excelBuf = fs.readFileSync('./test/data/ambiental_licenses.xlsx');
    importExcel(excelBuf, 'AmbientalLicense', onImportDone, onError);
    
    function onImportDone(status, invalidRecordsStatus) {
        var rows = await( dbUtils.findAllCustom(db.models.AmbientalLicense));
        test.equal( 17, rows.length );  
        var expectedStatus = "Registros criados: 14";
        expectedStatus += "\nRegistros atualizados: 5";
        expectedStatus += "\nRegistros inválidos: 1";
        test.equal( expectedStatus, status );
        test.equal( 1, invalidRecordsStatus.length );
        test.equal('Registro 10: notNull Violation: end cannot be null', invalidRecordsStatus[0]);
        
        test.equal('2015-01-09', rows[0].start.toJSON().substring(0, 10));
        test.equal('2016-01-09', rows[0].end.toJSON().substring(0, 10));
        test.equal('ABio 560/2014', rows[0].license);
        test.equal('Perfuração Marítima - Bloco BM-CAL-13 - Bacia de Camamu-Almada', rows[0].enterprise);
        test.equal('BP ENERGY DO BRASIL LTDA', rows[0].entrepreneur);
        test.equal('02022.001868/2007-89', rows[0].process);
        test.equal('Petróleo - Perfuração', rows[0].tipology);
        test.equal('Não', rows[0].pac);
        
        test.equal('2015-07-31', rows[9].start.toJSON().substring(0, 10));
        test.equal('2018-07-31', rows[9].end.toJSON().substring(0, 10));
        test.equal('Ret ABio 269/2013', rows[9].license);
        test.equal('Perfuração Marítima - Blocos BM-POT-16 e 17 - Bacia de Potiguar', rows[9].enterprise);
        test.equal('PETRÓLEO BRASILEIRO S/A - PETROBRÁS', rows[9].entrepreneur);
        test.equal('02022.004723/2006-59', rows[9].process);
        test.equal('Petróleo - Perfuração', rows[9].tipology);
        test.equal('Não', rows[9].pac);
        
        test.done();
    }
},*/


importBlocks: test => {
    var fixtureCount = 3;
    test.equal( fixtureCount, await( db.models.Block.findAll() ).length );  
    var excelBuf = fs.readFileSync('./test/data/blocks.xlsx');
    importExcel(excelBuf, 'Block', onImportDone, onError);
    
    function onImportDone(status, invalidRecordsStatus) {
        var rows = await( dbUtils.findAllCustom(db.models.Block));
        test.equal( 344, rows.length );  
        var expectedStatus = "Registros criados: 341";
        expectedStatus += "\nRegistros atualizados: 3";
        expectedStatus += "\nRegistros inválidos: 3";
        test.equal( expectedStatus, status );
        var expectedInvalidStatus = [
            'Registro 289: Valor \'Cemes\' do campo \'operador\' não encontrado.',
            'Registro 293: Valor \'Cemes\' do campo \'operador\' não encontrado.',
            'Registro 294: Valor \'Cemes\' do campo \'operador\' não encontrado.' 
        ];
        compareArray(test, expectedInvalidStatus, invalidRecordsStatus);
        
        {
            const record = rows[0];
            test.equal('BM-BAR-1', record.name);
            test.equal('BM-BAR-1', record.name_contract);
            test.equal('BID3', record.bid);
            test.equal('2004-08-29', record.end_1.toJSON().substring(0, 10));
            test.equal('2012-07-18', record.end_2.toJSON().substring(0, 10));
            test.equal('2014-04-20', record.end_3.toJSON().substring(0, 10));
            test.equal('2016-12-31', record.end_last.toJSON().substring(0, 10));
            test.equal('SUSPENSO', record.status);
            test.equal('*Petrobras - 75%, ONGC Campos - 25%', record.concessionaries);
            test.equal('Petrobras', record.operator.name);
            test.equal('Barreirinhas', record.basin.name);           
        }

        {
            const record = rows[300];
            test.equal('SEAL-M-424', record.name);
            test.equal('BM-SEAL-10', record.name_contract);
            test.equal('BID6', record.bid);
            test.equal('2010-12-23', record.end_1.toJSON().substring(0, 10));
            test.equal('2013-02-28', record.end_2.toJSON().substring(0, 10));
            test.equal(null, record.end_3);
            test.equal('2018-12-30', record.end_last.toJSON().substring(0, 10));
            test.equal('EM ANÁLISE', record.status);
            test.equal('*Petrobras - 100%', record.concessionaries);
            test.equal('Petrobras', record.operator.name);
            test.equal('Sergipe', record.basin.name);
        }     
        
        test.done();
    }
},

/*
importPersons: test => {
    var fixtureCount = 3;
    test.equal( fixtureCount, await( db.models.Person.findAll() ).length );  
    var excelBuf = fs.readFileSync('./test/data/persons.xlsx');
    importExcel(excelBuf, 'Person', onImportDone, onError);
    
    function onImportDone(status, invalidRecordsStatus) {
        var rows = await( dbUtils.findAllCustom(db.models.Person));
        console.log(rows);
        test.equal( 344, rows.length );  
        var expectedStatus = "Registros criados: 341";
        expectedStatus += "\nRegistros atualizados: 3";
        expectedStatus += "\nRegistros inválidos: 3";
        test.equal( expectedStatus, status );
        var expectedInvalidStatus = [
            'Registro 289: Valor \'Cemes\' do campo \'operador\' não encontrado.',
            'Registro 293: Valor \'Cemes\' do campo \'operador\' não encontrado.',
            'Registro 294: Valor \'Cemes\' do campo \'operador\' não encontrado.' 
        ];
        compareArray(test, expectedInvalidStatus, invalidRecordsStatus);
        
        {
            const record = rows[0];
            test.equal('BM-BAR-1', record.name);
            test.equal('BM-BAR-1', record.name_contract);
            test.equal('BID3', record.bid);
            test.equal('2004-08-29', record.end_1.toJSON().substring(0, 10));
            test.equal('2012-07-18', record.end_2.toJSON().substring(0, 10));
            test.equal('2014-04-20', record.end_3.toJSON().substring(0, 10));
            test.equal('2016-12-31', record.end_last.toJSON().substring(0, 10));
            test.equal('SUSPENSO', record.status);
            test.equal('*Petrobras - 75%, ONGC Campos - 25%', record.concessionaries);
            test.equal('Petrobras', record.operator.name);
            test.equal('Barreirinhas', record.basin.name);           
        }

        {
            const record = rows[300];
            test.equal('SEAL-M-424', record.name);
            test.equal('BM-SEAL-10', record.name_contract);
            test.equal('BID6', record.bid);
            test.equal('2010-12-23', record.end_1.toJSON().substring(0, 10));
            test.equal('2013-02-28', record.end_2.toJSON().substring(0, 10));
            test.equal(null, record.end_3);
            test.equal('2018-12-30', record.end_last.toJSON().substring(0, 10));
            test.equal('EM ANÁLISE', record.status);
            test.equal('*Petrobras - 100%', record.concessionaries);
            test.equal('Petrobras', record.operator.name);
            test.equal('Sergipe', record.basin.name);
        }     
        
        test.done();
    }
},*/

/*
export: test => {
	const excelBuf = ExportExcel.main('Well');
    //const workbook = XLSX.read(excelBuf, {type:"buffer", cellDates: true});
    test.done();
},*/


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

exports.group = fiberTests.convertTests( group, false );