 "use strict";
 
import { fieldTypeStr } from '../ModelUtils';
import db = require( '../../db/models' );
import dsParams = require('./../DataSourcesParams');
import winston = require('winston');
import Sequelize = require('sequelize');  
var XLSX = require('xlsx');
var Sync = require('sync');
import { await } from '../../lib/await';
import moment = require('moment-timezone');

const saoPauloZone = moment.tz.zone('America/Sao_Paulo');

export interface ISaveRecord {
    worksheet: any;
    row: number;
    keyFieldIndexInExcel: number;
    modelKeyField: string;
    model: any;
    header: any;
    insertedRecords: number;
    updatedRecords: number;
    excelParams: any;
    invalidStatus: string[];
};

export interface IOkFunc {
    (status: string, recordsStatus: string[]): void;
}
  
export interface IExcelUploadResponse {
    status: string;
    invalidRecordsStatus: string[];  
}

export class ImportExcel {

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

    protected getLineOffset(worksheet):number {
        return 0;
    }

    getHeader(worksheet, lineOffset) {
        var header = this.getRowValues(worksheet, lineOffset);
        for( var i = 0; i < header.length; i++ )
            header[i] = header[i].toLowerCase().trim();
        return header;
    }

    validateHeader(header, modelName) {
        var excelParams = dsParams[modelName].excelParams;
        const missingFields = [];
        for( var key in excelParams.fields ){
            if( header.indexOf(key.toLowerCase()) < 0 ) {
                missingFields.push(key);
            }
        }
        if(missingFields.length > 0) {
            throw "O cabeçalho do arquivo Excel não possui o(s) campo(s) " + missingFields.join(', ');
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
        const labelField = dsParams[association.target.name].labelField;
        var searchParams = {}; 
        searchParams[labelField] = value;
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
            var typeStr = fieldTypeStr(model.attributes[fieldName]);
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

    protected genStatusStr(insertedRecords, updatedRecords, invalidStatus) {
        var status = '';
        status += "Registros criados: " + insertedRecords;
        status += "\nRegistros atualizados: " + updatedRecords;
        status += "\nRegistros inválidos: " + invalidStatus.length;
        return status;
    }

    execute(excelBuf, modelName: string):Promise<IExcelUploadResponse> {
        const _this = this;
        
        const promise = new Promise<IExcelUploadResponse>( function(resolve, reject) { Sync( function() {
            try{
                const workbook = _this.getWorkbook(excelBuf);
                const first_sheet_name = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[first_sheet_name];
                const lineOffset = _this.getLineOffset(worksheet);
                const header = _this.getHeader(worksheet, lineOffset);
                _this.validateHeader(header, modelName);
                
                const excelParams = dsParams[modelName].excelParams;
                const range = _this.getRange(worksheet);

                const saveRecordData: ISaveRecord = {
                    worksheet,
                    row: -1,
                    keyFieldIndexInExcel: header.indexOf( excelParams.keyField ),
                    modelKeyField: excelParams.fields[ excelParams.keyField ],
                    model: db.models[modelName],
                    header,
                    insertedRecords: 0,
                    updatedRecords: 0,
                    excelParams,
                    invalidStatus: []
                };
                
                const numRows = range.e.r;
                for( var row = 1 + lineOffset; row <= numRows; row++ ) {
                    saveRecordData.row = row;
                    if(!_this.saveRecord(saveRecordData)) {
                        continue;
                    }
                    
                    if((row % 1000) == 0) {
                        const partialStatus = _this.genStatusStr(saveRecordData.insertedRecords, 
                                                                 saveRecordData.updatedRecords, 
                                                                 saveRecordData.invalidStatus);
                        db.models.ExcelImportLog.create({
                            model: modelName,
                            status: 'Atualização ' + row + '/' + numRows,
                            result: partialStatus + '\n' + saveRecordData.invalidStatus.join('\n')
                        });
                    }
                }
                const status = _this.genStatusStr(saveRecordData.insertedRecords,
                                                  saveRecordData.updatedRecords, 
                                                  saveRecordData.invalidStatus);

                db.models.ExcelImportLog.create({
                    model: modelName,
                    status: 'OK',
                    result: status + '\n' + saveRecordData.invalidStatus.join('\n')
                });

                resolve( { status: status, invalidRecordsStatus: saveRecordData.invalidStatus });
            } catch(err) {
                winston.error('Erro ao importar: ', row, err);
                db.models.ExcelImportLog.create({
                    model: modelName,
                    status: 'ERROR',
                    result: JSON.stringify(err)
                });
                reject(err);
            }
        }); 
        });
        return promise;
    }

    protected saveRecord(d: ISaveRecord):boolean {
        const rowValues = this.getRowValues(d.worksheet, d.row);
        const searchParams:any = {};
        var searchKeyValue = rowValues[d.keyFieldIndexInExcel];
        searchKeyValue = this.cleanString(searchKeyValue)
        searchParams[d.modelKeyField] = searchKeyValue;
        var record = await( d.model.findOne({ where: searchParams }) );
        if( record ) {
            try {
                this.setRecord(record, d.header, d.excelParams.fields, rowValues, d.model);
                await( record.save() );
                d.updatedRecords++;
            } catch(error) {
                this.addError(error, d.row, d.invalidStatus);
            }
        } else {
            record = {};
            try {
                this.setRecord(record, d.header, d.excelParams.fields, rowValues, d.model);
                await( d.model.create(record) );
                d.insertedRecords++;
            } catch(error) {
                this.addError(error, d.row, d.invalidStatus);
            }
        }
        return true;
    }

    protected addError(error, row, invalidStatus) {
        var msg = error.message;
        if(!msg)
            msg = error;
        invalidStatus.push( 'Registro ' + row + ': ' + msg ); // pseudoerror. It's about not finding a record
    }

    getTimeInMillisecondsFromExcelTime(excelTime:number, baseDate:Date):number {
        const dateOpeningMili = baseDate.getTime();
        // Convert all the datetimes to Sao Paulo time zone
        const tzOffsetInMinutes = saoPauloZone.offset(dateOpeningMili);
        const timeFromExcelInMinutes = excelTime * 24 * 60;
        const resultTimeUTCInMinutes = timeFromExcelInMinutes + tzOffsetInMinutes;
        const result = resultTimeUTCInMinutes * 60000;
        return result;
    }

}