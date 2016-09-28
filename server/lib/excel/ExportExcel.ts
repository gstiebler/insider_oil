"use strict";

import { await } from '../../lib/await';
var XLSX = require('xlsx');
import { fieldTypeStr } from '../ModelUtils';
import dbUtils = require('../dbUtils');
import dsParams = require('./../DataSourcesParams');
import winston = require('winston');
import moment = require('moment-timezone');

const saoPauloZone = moment.tz.zone('America/Sao_Paulo');

const milisecondsInDay = 24 * 60 * 60 * 1000;
const baseDateNum = 25569 * milisecondsInDay; // 01/01/1970

function datenum(v, date1904?:any) {
	if(date1904) v+=1462;
	const epoch = Date.parse(v);
	const miliSum = epoch + baseDateNum ;
	const result = miliSum / milisecondsInDay; 
	return result;
}

function sheet_from_array_of_arrays(data: any[], opts?:any) {
	var ws = {};
	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
	for(var R = 0; R != data.length; ++R) {
		for(var C = 0; C != data[R].length; ++C) {
			if(range.s.r > R) range.s.r = R;
			if(range.s.c > C) range.s.c = C;
			if(range.e.r < R) range.e.r = R;
			if(range.e.c < C) range.e.c = C;
			var cell:any = {v: data[R][C] };
			if(cell.v == null) continue;
			var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
			
			if(typeof cell.v === 'number') cell.t = 'n';
			else if(typeof cell.v === 'boolean') cell.t = 'b';
			else if(cell.v instanceof Date) {
				cell.t = 'n'; cell.z = XLSX.SSF._table[14];
				cell.v = datenum(cell.v);
			}
			else cell.t = 's';
			
			ws[cell_ref] = cell;
		}
	}
	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
	return ws;
}

function Workbook():void {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}


function exportExcel(records: any[], dataSource: dbUtils.ioDataSource, dataSourceName: string) {
	const fieldsArray = [];
	const fieldLabels = [];
	const dsParam = dsParams[dataSourceName];
    var excelParams = dsParam.excelParams;
    for( var key in excelParams.fields ){
    	const fieldName = excelParams.fields[key];
    	fieldsArray.push(fieldName);
    	fieldLabels.push(key);
    }
    
    const dataArray = [];
    dataArray.push(fieldLabels);
    for(var record of records) {
    	const line = [];
    	for(var field of fieldsArray) {      
    		var recordValue = record[field];
			var typeStr = fieldTypeStr(dataSource.attributes[field]);
			if(typeStr == 'DATETIME') {
				// Convert all the datetimes to Sao Paulo time zone
				const offsetInMinutes = saoPauloZone.offset(recordValue);
				const offsetInMiliseconds = offsetInMinutes * 60 * 1000;
				recordValue = new Date(recordValue.getTime() - offsetInMiliseconds);
			}
    		if(dataSource.associations[field] && record[field]) {
    			recordValue = record[field].name; //TODO get the label field, not always the 'name' field
    		}
			line.push(recordValue);
    	}
    	dataArray.push(line);
    }
    
    var wb = new Workbook(), ws = sheet_from_array_of_arrays(dataArray);

    var ws_name = 'Pasta principal';
    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;

    var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };
    return XLSX.write(wb,wopts);
    /* write file */
    //XLSX.writeFile(wb, 'test.xlsx');
}


export function main(dataSourceName: string) {
    const dataSource = dbUtils.getDataSource(dataSourceName);
    try {
        const records = await( dbUtils.findAllCustom(dataSource) );
        return exportExcel(records, dataSource, dataSourceName);
    } catch(e) {
    	winston.error(e.stack);
    	throw e;
    }
}