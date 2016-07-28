"use strict";

import { ImportExcel, IExcelUploadResponse } from './ImportExcelClass';
import { IOkFunc } from './ImportExcelClass';
import db = require( '../../db/models' );
import winston = require('winston');
import dsParams = require('./../DataSourcesParams');
var Sync = require('sync');
var await = require('../await');

export class Production extends ImportExcel {
    
    headerFields: any;
    
    constructor() {
        super();
        this.lineOffset = 5;
        this.headerFields = {
            name: 'anp',
            name_operator: 'operador',
            oil_field: 'campo',
            period: 'período',
            oil_production: 'óleo (bbl/dia)',
            oil_condensed_production: 'condensado (bbl/dia)',
            gas_associated_production: 'associado',
            gas_non_associated_production: 'não associado',
            gas_royaties_volume: 'volume gás royalties (mm³/dia)',
            water_production: 'água (bbl/dia)',
        };
    } 
    
    getHeader(worksheet, lineOffset) {
        const firstHeaderLine = 4;
        const header = this.getRowValues(worksheet, firstHeaderLine);
        const header2 = this.getRowValues(worksheet, firstHeaderLine + 1);
        for( var i = 0; i < header.length; i++ ) {
            header[i] = header[i].toLowerCase();
            if(header2[i] == '') {
                header[i] = header[i].toLowerCase();
            } else {
                header[i] = header2[i].toLowerCase();
            }
        }
        return header;
    }
    
    setRecord(record, header, rowObj) {
        for(let rowKey in rowObj) {
            record[rowKey] = rowObj[rowKey];
        }  
    }
    
    execute(excelBuf, modelName: string):Promise<IExcelUploadResponse> {
        const _this = this;
        
        const promise = new Promise<IExcelUploadResponse>( function(resolve, reject) { Sync( function() {
            try{
                const workbook = _this.getWorkbook(excelBuf);
                const first_sheet_name = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[first_sheet_name];
                
                const header = _this.getHeader(worksheet, _this.lineOffset);
                _this.validateHeader(header, modelName);
                const headerIndexes = _this.headerToIndexes(header);
                
                const excelParams = dsParams[modelName].excelParams;
                const keyFieldIndexInExcel = header.indexOf( excelParams.keyField );
                const modelKeyField = excelParams.fields[ excelParams.keyField ];
                const model = db.models[modelName];
                const range = _this.getRange(worksheet);
                let insertedRecords = 0;
                let updatedRecords = 0;

                var invalidStatus: string[] = [];
                function addError(error, row) {
                    var msg = error.message;
                    if(!msg)
                        msg = error;
                    invalidStatus.push( 'Registro ' + row + ': ' + msg ); // pseudoerror. It's about not finding a record
                }
                
                const numRows = range.e.r;
                for( var row = 1 + _this.lineOffset; row <= numRows; row++ ) {
                    const rowValues = _this.getRowValues(worksheet, row);
                    const rowObj = _this.rowValuesToObj(rowValues, headerIndexes);
                    const wellSearchParams = {
                        $or: {
                            name: _this.cleanString(rowObj.name),
                            name_operator: _this.cleanString(rowObj.name_operator)
                        }
                    };
                    const wellRecord = await( db.models.Well.findOne({ where: wellSearchParams }) );
                    if(!wellRecord) {
                        invalidStatus.push( "Poço não encontrado " + rowObj.name );
                        continue;
                    }
                    
                    var searchParams = {
                        well_id: wellRecord.id,
                        period_year: rowObj.period_year,
                        period_month: rowObj.period_month
                    };
                    var record = await( model.findOne({ where: searchParams }) );
                    if( record ) {
                        try {
                            _this.setRecord(record, header, rowObj);
                            await( record.save() );
                            updatedRecords++;
                        } catch(error) {
                            addError(error, row);
                        }
                    } else {
                        record = {};
                        try {
                            _this.setRecord(record, header, rowObj);
                            record.well_id = wellRecord.id;
                            await( model.create(record) );
                            insertedRecords++;
                        } catch(error) {
                            addError(error, row);
                        }
                    }
                    
                    if((row % 1000) == 0) {
                        const partialStatus = _this.genStatusStr(insertedRecords, updatedRecords, invalidStatus);
                        db.models.ExcelImportLog.create({
                            model: modelName,
                            status: 'Atualização ' + row + '/' + numRows,
                            result: partialStatus + '\n' + invalidStatus.join('\n')
                        });
                    }
                }
                const status = _this.genStatusStr(insertedRecords, updatedRecords, invalidStatus);

                db.models.ExcelImportLog.create({
                    model: modelName,
                    status: 'OK',
                    result: status + '\n' + invalidStatus.join('\n')
                });

                resolve( { status: status, invalidRecordsStatus: invalidStatus });
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
    
    headerToIndexes(header:string[]) {
        const headerIndexes = {};
        for( var key in this.headerFields ){
            const excelLabel = this.headerFields[key];
            headerIndexes[key] = header.indexOf(excelLabel);
        }
        return headerIndexes;
    }
    
    rowValuesToObj(rowValues, headerIndexes) {
        const obj:any = {};
        for( var key in this.headerFields ){
            obj[key] = rowValues[ headerIndexes[key] ];
        }
        const period = obj.period;
        const periodParts = period.split('/');
        obj.period_year = parseInt( periodParts[0] );
        obj.period_month = parseInt( periodParts[1] );
        
        return obj;
    }
}