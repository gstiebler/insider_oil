 "use strict";
 
import db = require( '../../db/models' );
import dsParams = require('./../DataSourcesParams');
import winston = require('winston');
import Sequelize = require('sequelize');  
var XLSX = require('xlsx');
var Sync = require('sync');
var await = require('../await');

export interface IOkFunc {
    (status: string, recordsStatus: string[]): void;
}
  
export interface IExcelUploadResponse {
    status: string;
    invalidRecordsStatus: string[];  
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

    getDateValue(value:any):any {
        if(value == '')
            return null;
        else if(typeof value == 'number')
            return this.XLSnum2date(value);
        else
            return this.str2date(value);
    }
    
    setRecordValueFromAssociation(record, value, headerField, association) {
        var searchParams = { name: value }; // TODO always using 'name' here
        try {
            var associatedRecord = await( association.target.findOne({ where: searchParams }) );
            if(!value || value == '') {
                record[association.identifierField] = null;
            } else if(associatedRecord) {
                record[association.identifierField] = associatedRecord.id;
            } else {
                throw "Valor '" + value + "' do campo '" + headerField + "' não encontrado.";
            } 
        } catch(e) {
            throw "Valor '" + value + "' do campo '" + headerField + "' não encontrado.";
        }
    }

    setRecord(record, header:string[], fields, rowValues, model) {
        const _dsParams = dsParams[model.name];
        for( var col = 0; col < header.length; col++ ) {
            var headerField = header[col];
            var fieldName = fields[ headerField ];
            if(!fieldName) continue;
            var typeStr = 'VARCHAR';
            try { // this try is due to an apparent bug with sequelize for ENUM fields
                typeStr = model.attributes[fieldName].type.toString();
            } catch(e) { }
            const value = rowValues[col];
            if(!value || value == '')
                continue;
            const association = model.associations[fieldName];
            if(association) {
                this.setRecordValueFromAssociation(record, value, headerField, association);
            } else if (typeStr == 'DATE' || typeStr == 'DATETIME') { // is date, should convert
                record[fieldName] = this.getDateValue(value);
            } else if(typeStr.includes('VARCHAR')) {
                record[fieldName] = this.cleanString(value);
            } else {
                record[fieldName] = value;
            }
            
            if(_dsParams.fields[fieldName] && _dsParams.fields[fieldName].isList) {
                const result = [];
                const arrayValues = value.split(',');
                for(let arrayValue of arrayValues)
                    result.push(this.cleanString(arrayValue));
                record[fieldName] = result;
            }
        }    
    }
    
    cleanString(input:string): string {
        return input.toString().trim().replace(/\s+/g,' ');
    }
    
    getWorkbook(excelBuf) {
        return XLSX.read(excelBuf, {type:"buffer", cellDates: true});
    }
    
    getRange(worksheet) {
        return XLSX.utils.decode_range(worksheet['!ref']);
    }

    execute(excelBuf, modelName: string):Promise<IExcelUploadResponse> {
        const workbook = this.getWorkbook(excelBuf);
        const first_sheet_name = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[first_sheet_name];
        
        const header = this.getHeader(worksheet, this.lineOffset);
        this.validateHeader(header, modelName);
        
        const excelParams = dsParams[modelName].excelParams;
        const keyFieldIndexInExcel = header.indexOf( excelParams.keyField );
        const modelKeyField = excelParams.fields[ excelParams.keyField ];
        const model = db.models[modelName];
        const range = this.getRange(worksheet);
        let insertedRecords = 0;
        let updatedRecords = 0;
        const _this = this;
        
        const promise = new Promise<IExcelUploadResponse>( function(resolve, reject) { Sync( function() {
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
                    const rowValues = _this.getRowValues(worksheet, row);
                    const searchParams:any = {};
                    var searchKeyValue = rowValues[keyFieldIndexInExcel];
                    searchKeyValue = _this.cleanString(searchKeyValue)
                    searchParams[modelKeyField] = searchKeyValue;
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
                resolve( { status: status, invalidRecordsStatus: invalidStatus });
            } catch(err) {
                winston.error('Erro ao importar: ', row, err);
                reject(err);
            }
        }); 
        });
        return promise;
    }

}