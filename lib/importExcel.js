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
    for( key in excelParams.fields ){
        if( header.indexOf(key) < 0 )
            throw "O cabeçalho do arquivo Excel não possui o campo " + key;
    }
}  


function setRecord(record, header, fields, rowValues) {
    for( var col = 0; col < header.length; col++ ) {
        var headerField = header[col];
        var fieldName = fields[ headerField ];
        record[fieldName] = rowValues[col];
    }    
}


module.exports = function(excelBuf, modelName, onOk, onError) {
    var workbook = XLSX.read(excelBuf, {type:"buffer"});
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
            for( var row = 1; row <= range.e.r; row++ ) {
                var rowValues = getRowValues(worksheet, row);
                var searchParams = {};
                searchParams[modelKeyField] = rowValues[keyFieldIndexInExcel];
                record = await( model.findOne({ where: searchParams }) );
                if( record ) {
                    setRecord(record, header, excelParams.fields, rowValues);
                    record.save().catch( function(err) {
                        onError(err);
                    });
                    updatedRecords++;
                } else {
                    var record = {};
                    setRecord(record, header, excelParams.fields, rowValues);
                    model.create(record).catch( function(err) {
                        onError(err);
                    });
                    insertedRecords++;
                }
            }
            var status = "Registros criados: " + insertedRecords;
            status += "\nRegistros atualizados: " + updatedRecords;
            onOk(status);
        } catch(err) {
            console.log(err);
            onError();
        }
    });
}