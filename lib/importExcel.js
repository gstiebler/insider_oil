"use strict";
var XLSX = require('xlsx');
var db = require( '../db/models' );
var ExcelParams = require('../lib/ExcelParams');
var Sync = require('sync');
var await = require('./await');


function getRowValues(worksheet, row) {
    var rowValues = [];
    var range = XLSX.utils.decode_range(worksheet['!ref']);
    var firstCol = range.s.c;
    var lastCol = range.e.c;
    for( var col = firstCol; col <= lastCol; col++ ) {
        var cellAddress = XLSX.utils.encode_cell({r: row, c: col});
        var cell = worksheet[cellAddress];
        if( cell )
            rowValues.push( cell.v );
        else
            rowValues.push("");
    }
    
    return rowValues;
}

function getHeader(worksheet) {
    var header = getRowValues(worksheet, 0);
    for( var i = 0; i < header.length; i++ )
        header[i] = header[i].toLowerCase();
    return header;
}


function validateHeader(header, modelName) {
    var excelParams = ExcelParams[modelName]();
    for( var key in excelParams.fields ){
        if( header.indexOf(key) < 0 )
            throw "O cabeçalho do arquivo Excel não possui o campo " + key;
    }
}  


function XLSnum2date(v) {
	var date = XLSX.SSF.parse_date_code(v);
	var val = new Date();
	val.setUTCDate(date.d);
	val.setUTCMonth(date.m-1);
	val.setUTCFullYear(date.y);
	val.setUTCHours(date.H);
	val.setUTCMinutes(date.M);
	val.setUTCSeconds(date.S);
	return val;
}


function setRecord(record, header, fields, rowValues, model) {
    for( var col = 0; col < header.length; col++ ) {
        var headerField = header[col];
        var fieldName = fields[ headerField ];
        const value = rowValues[col];
        if(model.associations[fieldName]) {
            const association = model.associations[fieldName];
            var searchParams = { name: value }; // TODO always using 'name' here
            var associatedRecord = await( association.target.findOne({ where: searchParams }) );
            if(associatedRecord) {
                record[association.identifierField] = associatedRecord.id;
            } else {
                throw "Valor '" + value + "' do campo '" + headerField + "' não encontrado.";
            }
        } else if (model.attributes[fieldName].type.toString() == 'DATETIME') { // is date, should convert
            record[fieldName] = XLSnum2date(value);
        } else {
            record[fieldName] = value;
        }
    }    
}


module.exports = function(excelBuf, modelName, onOk, onError) {
    var workbook = XLSX.read(excelBuf, {type:"buffer", cellDates: true});
    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];
    
    var header = getHeader(worksheet);
    validateHeader(header, modelName);
    
    var insertedRecords = 0;
    var updatedRecords = 0;
    var excelParams = ExcelParams[modelName]();
    var keyFieldIndexInExcel = header.indexOf( excelParams.keyField );
    var modelKeyField = excelParams.fields[ excelParams.keyField ];
    var model = db[modelName];
    var range = XLSX.utils.decode_range(worksheet['!ref']);
    Sync( function() {
        try{
            var status = "";
            var invalidStatus = [];
            for( var row = 1; row <= range.e.r; row++ ) {
                var rowValues = getRowValues(worksheet, row);
                var searchParams = {};
                searchParams[modelKeyField] = rowValues[keyFieldIndexInExcel];
                var record = await( model.findOne({ where: searchParams }) );
                if( record ) {
                    try {
                        setRecord(record, header, excelParams.fields, rowValues, model);
                        record.save().catch( function(err) {
                            onError(err);
                        });
                        updatedRecords++;
                    } catch(error) {
                        invalidStatus.push( error ); // pseudoerror. It's about not finding a record
                    }
                } else {
                    record = {};
                    try {
                        setRecord(record, header, excelParams.fields, rowValues, model);
                        model.create(record).catch( function(err) {
                            onError(err);
                        });
                        insertedRecords++;
                    } catch(error) {
                        invalidStatus.push( error ); // pseudoerror. It's about not finding a record
                    }
                }
            }
            status += "Registros criados: " + insertedRecords;
            status += "\nRegistros atualizados: " + updatedRecords;
            status += "\nRegistros inválidos: " + invalidStatus.length;
            onOk(status, invalidStatus);
        } catch(err) {
            onError(err);
        }
    });
}