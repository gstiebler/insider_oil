"use strict";

import { ImportExcel } from './ImportExcelClass';
import { IOkFunc } from './ImportExcelClass';
import db = require( '../../db/models' );
import winston = require('winston');
var Sync = require('sync');
var await = require('../await');

export class Production extends ImportExcel {
    
    headerFields: any;
    
    constructor() {
        super();
        this.lineOffset = 5;
        this.headerFields = {
            name: 'anp',
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
    
    validateHeader(header, modelName) {
        for( var key in this.headerFields ){
            const excelLabel = this.headerFields[key];
            if( header.indexOf(excelLabel.toLowerCase()) < 0 )
                throw "O cabeçalho do arquivo Excel não possui o campo " + excelLabel;
        }
    } 
    
    setRecord(record, header, rowObj) {
        for(let rowKey in rowObj) {
            record[rowKey] = rowObj[rowKey];
        }  
    }
    
    execute(excelBuf, modelName: string, onOk: IOkFunc, onError) {
        const workbook = this.getWorkbook(excelBuf);
        const first_sheet_name = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[first_sheet_name];
        
        const header = this.getHeader(worksheet, this.lineOffset);
        this.validateHeader(header, modelName);
        const headerIndexes = this.headerToIndexes(header);
        
        const model = db.models.Production;
        const range = this.getRange(worksheet);
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
                    const rowValues = _this.getRowValues(worksheet, row);
                    const rowObj = _this.rowValuesToObj(rowValues, headerIndexes);
                    const wellSearchParams = {
                        name: _this.cleanString(rowObj.name)
                    };
                    const wellRecord = await( db.models.ProductionWell.findOne({ where: wellSearchParams }) );
                    if(!wellRecord) {
                        invalidStatus.push( "Poço não encontrado " + rowObj.name );
                        continue;
                    }
                    
                    var searchParams = {
                        production_well_id: wellRecord.id,
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
                            record.production_well_id = wellRecord.id;
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
    
    cleanString(input:string): string {
        return input.trim().replace(/\s+/g,' ');
    }
}