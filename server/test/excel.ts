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
import { IExcelUploadResponse } from '../lib/excel/ImportExcelClass';
const moment = require('moment-timezone');
var utils = require('./lib/utils');

const saoPauloZone = moment.tz('America/Sao_Paulo');

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
    var excelBuf = fs.readFileSync('./test/data/drilling_rigs_offshore.xls');
    const result:IExcelUploadResponse = await(importExcel(excelBuf, 'DrillingRigOffshore'));
    const invalidRecordsStatus = result.invalidRecordsStatus;    
    const status = result.status;    
    
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
},


importBlocks: test => {
    var fixtureCount = 3;
    test.equal( fixtureCount, await( db.models.Block.findAll() ).length );  
    var excelBuf = fs.readFileSync('./test/data/blocks.xlsx');
    const result:IExcelUploadResponse = await(importExcel(excelBuf, 'Block'));
    const invalidRecordsStatus = result.invalidRecordsStatus;    
    const status = result.status;    
    
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
},

importPersons: test => {
    var fixtureCount = 3;
    test.equal( fixtureCount, await( db.models.Person.findAll() ).length );  
    var excelBuf = fs.readFileSync('./test/data/persons.xlsx');
    const result:IExcelUploadResponse = await(importExcel(excelBuf, 'Person'));
    const invalidRecordsStatus = result.invalidRecordsStatus;    
    const status = result.status;    
    
    var rows = await( dbUtils.findAllCustom(db.models.Person, { order: ['name'] }));
    test.equal( 4, rows.length );  
    var expectedStatus = "Registros criados: 1";
    expectedStatus += "\nRegistros atualizados: 3";
    expectedStatus += "\nRegistros inválidos: 1";
    test.equal( expectedStatus, status );
    var expectedInvalidStatus = [
        'Registro 5: Valor \'BR Distribuidora\' do campo \'empresa\' não encontrado.',
    ];
    compareArray(test, expectedInvalidStatus, invalidRecordsStatus);
    {
        const record = rows[0];
        test.equal('Carlos Alberto B.Tessarollo', record.name);
        test.equal(1, record.emails.length);
        test.equal('tessarollo@br.com.br', record.emails[0]);
    }  
    {
        const record = rows[2];
        test.equal('Guilherme Stiebler', record.name);
        test.equal(2, record.emails.length);
        test.equal('gstiebler@gmail.com', record.emails[0]);
        test.equal('guilhermeabc@gmail.com', record.emails[1]);
    }   
    
    test.done();
},


wellProduction: test => {
    var excelBuf = fs.readFileSync('./test/data/production.xls');
    const result:IExcelUploadResponse = await(importExcel(excelBuf, 'Production'));
    const invalidRecordsStatus = result.invalidRecordsStatus;    
    const status = result.status;    
    
    const order = ['period_year', 'period_month', 'well.name'];
    var rows = await( dbUtils.findAllCustom(db.models.Production, { order: order }));
    test.equal( 10, rows.length );  
    var expectedStatus = "Registros criados: 2";
    expectedStatus += "\nRegistros atualizados: 1";
    expectedStatus += "\nRegistros inválidos: 14";
    test.equal( expectedStatus, status );
    
    {
        const record = rows[3];
        test.equal('7AB 0047D RJS', record.well.name);
        test.equal(329.222, record.oil_production);
        test.equal(0.0, record.oil_condensed_production);
        test.equal(6.1391, record.gas_associated_production);
        test.equal(0, record.gas_non_associated_production);
        test.equal(183.392, record.gas_royaties_volume);
        test.equal(549.254, record.water_production);
    }  
    {
        const record = rows[5];
        test.equal('7MRL 0062D RJS', record.well.name);
        test.equal(2325.89, record.oil_production);
    }   
    
    test.done();
},

oilFields: test => {
    var excelBuf = fs.readFileSync('./test/data/oil_fields.xlsx');
    const result:IExcelUploadResponse = await(importExcel(excelBuf, 'OilField'));
    
    const order = ['name'];
    var rows = await( dbUtils.findAllCustom(db.models.OilField, { order: order }));
    test.equal( 14, rows.length );  
    var expectedStatus = "Registros criados: 1";
    expectedStatus += "\nRegistros atualizados: 13";
    expectedStatus += "\nRegistros inválidos: 0";
    test.equal( expectedStatus, result.status );
    
    test.done();
},

/*
export: test => {
	const excelBuf = ExportExcel.main('Well');
    //const workbook = XLSX.read(excelBuf, {type:"buffer", cellDates: true});
    test.done();
},*/


invalidHeader: function(test) {
    var excelBuf = fs.readFileSync('./test/data/drilling_rigs_offshore.xls');
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
},

productionUnits: test => {
    var excelBuf = fs.readFileSync('./test/data/production_units.xlsx');
    const result:IExcelUploadResponse = await(importExcel(excelBuf, 'ProductionUnit'));
    
    var rows = await( dbUtils.findAllCustom(db.models.ProductionUnit, { order: ['name'] }));
    test.equal( 9, rows.length );  
    var expectedStatus = "Registros criados: 0";
    expectedStatus += "\nRegistros atualizados: 9";
    expectedStatus += "\nRegistros inválidos: 0";
    test.equal( expectedStatus, result.status );
    
    {
        const record = rows[0];
        test.equal('Capixaba', record.name);
        test.equal('2015-03-30', record.end.toJSON().substring(0, 10));
        test.equal(302000.3, record.day_rate);
    } 
    
    test.done();
},

bids: test => {
    var excelBuf = fs.readFileSync('./test/data/bids.xlsx');
    const result:IExcelUploadResponse = await(importExcel(excelBuf, 'Bid'));
    
    var rows = await( dbUtils.findAllCustom(db.models.Bid, { order: ['process_number'] }));
    test.equal( 4, rows.length );  
    var expectedStatus = "Registros criados: 1";
    expectedStatus += "\nRegistros atualizados: 3";
    expectedStatus += "\nRegistros inválidos: 0";
    test.equal( expectedStatus, result.status );
    
    {
        const record = rows[0];
        test.equal('1234', record.process_number);
        test.equal('23/01/1981-20:23', moment.tz(record.opening_moment, 'America/Sao_Paulo').format('DD/MM/YYYY-HH:mm'));
        test.equal('objeto teste', record.contract_object);
        test.equal( utils.idByName('OilField', 'Abalone'), record.obj_id );
        test.equal( utils.idByName('ModelsList', 'OilField'), record.model_id );
    }
    
    test.done();
},

contracts: test => {
    var excelBuf = fs.readFileSync('./test/data/contracts.xlsx');
    const result:IExcelUploadResponse = await(importExcel(excelBuf, 'Contract'));
    
    var rows = await( dbUtils.findAllCustom(db.models.Contract, { order: ['user_uid'] }));
    test.equal( 4, rows.length );  
    var expectedStatus = "Registros criados: 1";
    expectedStatus += "\nRegistros atualizados: 3";
    expectedStatus += "\nRegistros inválidos: 0";
    test.equal( expectedStatus, result.status );
    
    {
        const record = rows[1]; 
        test.equal('250', record.user_uid);
        test.equal('Teste fornecedor', record.supplier);
        test.equal(utils.idByName('Company', 'Petrobras'), record.contractor_id);
        test.equal( utils.idByName('ProductionUnit', 'Cidade de Magaratiba'), record.obj_id );
        test.equal( utils.idByName('ModelsList', 'ProductionUnit'), record.model_id );
        test.equal( 'Euro', record.currency );
    }
    
    test.done();
},

companies: test => {
    var excelBuf = fs.readFileSync('./test/data/companies.xlsx');
    const result:IExcelUploadResponse = await(importExcel(excelBuf, 'Company'));
    
    var rows = await( dbUtils.findAllCustom(db.models.Company, { order: ['name'] }));
    test.equal( 49, rows.length );  
    var expectedStatus = "Registros criados: 3";
    expectedStatus += "\nRegistros atualizados: 1";
    expectedStatus += "\nRegistros inválidos: 0";
    test.equal( expectedStatus, result.status );
    
    const record = await( db.models.Company.findOne({ where: {name: 'Pepsi'} }) ); 
    test.equal('Pepsi', record.name);
    test.equal(null, record.telephones);
    
    test.done();
},

wells: test => {
    var excelBuf = fs.readFileSync('./test/data/wells.xlsx');
    const result:IExcelUploadResponse = await(importExcel(excelBuf, 'Well'));
    
    var rows = await( dbUtils.findAllCustom(db.models.Well, { order: ['name'] }));
    test.equal( 10, rows.length );  
    var expectedStatus = "Registros criados: 0";
    expectedStatus += "\nRegistros atualizados: 10";
    expectedStatus += "\nRegistros inválidos: 0";
    test.equal( expectedStatus, result.status );

    {
        const record = rows[7];
        
        test.equal('7MRL 0054 RJS', record.name);
        test.equal('Aban Abraham', record.drilling_rig_uniname);
        test.equal(utils.idByName('OilField', 'Marlim'), record.oil_field_id);
    }

    test.done();
},



};

exports.group = fiberTests.convertTests( group, false );