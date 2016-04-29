 "use strict";
 
import db = require( '../../db/models' );
import dsParams = require('./../DataSourcesParams');
import winston = require('winston');
var XLSX = require('xlsx');
var Sync = require('sync');
var await = require('../await');

export interface IOkFunc {
    (status: string, recordsStatus: string[]): void;
}

export class ImportExcel {
    
    lineOffset: number;
    
    constructor() {
        this.lineOffset = 0;
    }

    getRowValues(worksheet, row) {
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

    getHeader(worksheet, lineOffset) {
        var header = this.getRowValues(worksheet, lineOffset);
        for( var i = 0; i < header.length; i++ )
            header[i] = header[i].toLowerCase();
        return header;
    }


    validateHeader(header, modelName) {
        var excelParams = dsParams[modelName].excelParams;
        for( var key in excelParams.fields ){
            if( header.indexOf(key.toLowerCase()) < 0 )
                throw "O cabeçalho do arquivo Excel não possui o campo " + key;
        }
    }  


    XLSnum2date(v) {
        var date = XLSX.SSF.parse_date_code(v);
        var val = new Date(0);
        val.setUTCFullYear(date.y);
        val.setUTCMonth(date.m-1);
        val.setUTCDate(date.d);
        val.setUTCHours(date.H);
        val.setUTCMinutes(date.M);
        val.setUTCSeconds(date.S);
        return val;
    }


    str2date(dateStr) {
        try {
            const dateParts = dateStr.split('/');
            if(dateParts.length != 3)
                return null;
            const formattedDateStr = dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0];
            const resultDate = new Date(formattedDateStr);
            return resultDate;
        } catch(err) {
            return null;
        }
    }


    setRecord(record, header, fields, rowValues, model) {
        for( var col = 0; col < header.length; col++ ) {
            var headerField = header[col];
            var fieldName = fields[ headerField ];
            if(!fieldName) continue;
            var typeStr = 'VARCHAR';
            try { // this try is due to an apparent bug with sequelize for ENUM fields
                typeStr = model.attributes[fieldName].type.toString();
            } catch(e) { }
            const value = rowValues[col];
            if(model.associations[fieldName]) {
                const association = model.associations[fieldName];
                var searchParams = { name: value }; // TODO always using 'name' here
                try {
                    var associatedRecord = await( association.target.findOne({ where: searchParams }) );
                    if(associatedRecord) {
                        record[association.identifierField] = associatedRecord.id;
                    } else {
                        throw "Valor '" + value + "' do campo '" + headerField + "' não encontrado.";
                    } 
                } catch(e) {
                    throw "Valor '" + value + "' do campo '" + headerField + "' não encontrado.";
                }
                
            } else if (typeStr == 'DATE') { // is date, should convert
                if(value == '')
                    record[fieldName] = null;
                else if(typeof value == 'number')
                    record[fieldName] = this.XLSnum2date(value);
                else
                    record[fieldName] = this.str2date(value);
            } else {
                record[fieldName] = value;
            }
        }    
    }

    execute(excelBuf, modelName: string, onOk: IOkFunc, onError) {
        const workbook = XLSX.read(excelBuf, {type:"buffer", cellDates: true});
        const first_sheet_name = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[first_sheet_name];
        
        const header = this.getHeader(worksheet, this.lineOffset);
        this.validateHeader(header, modelName);
        
        const excelParams = dsParams[modelName].excelParams;
        const keyFieldIndexInExcel = header.indexOf( excelParams.keyField );
        const modelKeyField = excelParams.fields[ excelParams.keyField ];
        const model = db.models[modelName];
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        let insertedRecords = 0;
        let updatedRecords = 0;
        const _this = this;
        
        Sync( function() {
            try{
                var status = "";
                var invalidStatus: string[] = [];
                function addError(error, row) {
                    var msg = error.message;
                    if(!msg)
                        msg = error;
                    invalidStatus.push( 'Registro ' + row + ': ' + msg ); // pseudoerror. It's about not finding a record
                }
                
                for( var row = 1 + _this.lineOffset; row <= range.e.r; row++ ) {
                    var rowValues = _this.getRowValues(worksheet, row);
                    var searchParams = {};
                    searchParams[modelKeyField] = rowValues[keyFieldIndexInExcel];
                    var record = await( model.findOne({ where: searchParams }) );
                    if( record ) {
                        try {
                            _this.setRecord(record, header, excelParams.fields, rowValues, model);
                            await( record.save() );
                            updatedRecords++;
                        } catch(error) {
                            addError(error, row);
                        }
                    } else {
                        record = {};
                        try {
                            _this.setRecord(record, header, excelParams.fields, rowValues, model);
                            await( model.create(record) );
                            insertedRecords++;
                        } catch(error) {
                            addError(error, row);
                        }
                    }
                }
                status += "Registros criados: " + insertedRecords;
                status += "\nRegistros atualizados: " + updatedRecords;
                status += "\nRegistros inválidos: " + invalidStatus.length;
                onOk(status, invalidStatus);
            } catch(err) {
                winston.error('Erro ao importar: ', row, err);
                onError(err);
            }
        });
    }

}