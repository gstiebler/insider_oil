"use strict";

import { ImportExcel, IExcelUploadResponse, ISaveRecord } from './ImportExcelClass';
import { IOkFunc } from './ImportExcelClass';
import db = require( '../../db/models' );
import winston = require('winston');
import dsParams = require('./../DataSourcesParams');
var Sync = require('sync');
var await = require('../await');

export class Production extends ImportExcel {
    
    headerFields: any;
    private firstHeaderLine: number;
    
    constructor() {
        super();
        this.firstHeaderLine = -1;
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

    protected getLineOffset(worksheet):number {
        var currLine = 1;
        // detect first empty row
        for(; currLine < 50; currLine++) {
            const row = this.getRowValues(worksheet, currLine);
            if(row[0] == '') {
                break;
            }
        }
        // detect header after empty rows
        for(; currLine < 50; currLine++) {
            const row = this.getRowValues(worksheet, currLine);
            if(row[0] != '') {
                this.firstHeaderLine = currLine;
                return currLine + 1;
            }
        }
        return -1;
    }
    
    getHeader(worksheet, lineOffset) {
        const header = this.getRowValues(worksheet, this.firstHeaderLine);
        const header2 = this.getRowValues(worksheet, this.firstHeaderLine + 1);
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

    protected saveRecord(d: ISaveRecord):boolean {
        const headerIndexes = this.headerToIndexes(d.header);
        const rowValues = this.getRowValues(d.worksheet, d.row);
        const rowObj = this.rowValuesToObj(rowValues, headerIndexes);

        const simpleQueryType = { type: db.Sequelize.QueryTypes.SELECT};
        const select = 'select id ';
        const from = ' from wells ';
        var where = ' where name = "' + this.cleanString(rowObj.name) + '" ';
        where += ' or name_operator = "' + this.cleanString(rowObj.name_operator) + '" ';
        where += ' or replace(name, "-", "") = "' + this.cleanString(rowObj.name) + '" ';
        where += ' or replace(name_operator, "-", "") = "' + this.cleanString(rowObj.name_operator) + '" ';
        const queryStr = select + from + where;
        const queryRes = await( db.sequelize.query(queryStr, simpleQueryType) );
        const wellRecord = queryRes && queryRes.length > 0 ? queryRes[0] : null;
        if(!wellRecord) {
            d.invalidStatus.push( "Poço não encontrado " + rowObj.name );
            return false;
        }
        
        var searchParams = {
            well_id: wellRecord.id,
            period_year: rowObj.period_year,
            period_month: rowObj.period_month
        };
        var record = await( d.model.findOne({ where: searchParams }) );
        if( record ) {
            try { 
                this.setRecord(record, d.header, rowObj);
                await( record.save() );
                d.updatedRecords++;
            } catch(error) {
                this.addError(error, d.row, d.invalidStatus);
            }
        } else {
            record = {};
            try {
                this.setRecord(record, d.header, rowObj);
                record.well_id = wellRecord.id;
                await( d.model.create(record) );
                d.insertedRecords++;
            } catch(error) {
                this.addError(error, d.row, d.invalidStatus);
            }
        }
        return true;
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