"use strict";
var XLSX = require('xlsx');;
var db = require( '../db/models' );
var dbUtils = require('../lib/dbUtils');
var dsParams = require('./DataSourcesParams');
var await = require('../lib/await');

function datenum(v, date1904) {
	if(date1904) v+=1462;
	var epoch = Date.parse(v);
	return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
	var ws = {};
	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
	for(var R = 0; R != data.length; ++R) {
		for(var C = 0; C != data[R].length; ++C) {
			if(range.s.r > R) range.s.r = R;
			if(range.s.c > C) range.s.c = C;
			if(range.e.r < R) range.e.r = R;
			if(range.e.c < C) range.e.c = C;
			var cell = {v: data[R][C] };
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

function Workbook() {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}


function exportExcel(records, dataSource, dataSourceName) {
	const fieldsArray = [];
	const fieldLabels = [];
	const dsParam = dsParams[dataSourceName];
    var excelParams = dsParam.excelParams;
    for( var key in excelParams.fields ){
    	const fieldName = excelParams.fields[key];
    	fieldsArray.push(fieldName);
    	
		if(dataSource.associations[fieldName]) {
			const paramName = fieldName + '_name';
			fieldLabels.push(dsParam.fields[paramName].label);
		} else
			fieldLabels.push(dsParam.fields[fieldName].label);
    }
    
    const dataArray = [];
    dataArray.push(fieldLabels);
    for(var record of records) {
    	const line = [];
    	for(var field of fieldsArray) {
    		var recordValue = record[field];
    		if(dataSource.associations[field]) {
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

    /* write file */
    XLSX.writeFile(wb, 'test.xlsx');
}


exports.main = function(dataSourceName) {
    const dataSource = dbUtils.getDataSource(dataSourceName);
    try {
        const records = await( dbUtils.findAllCustom(dataSource, {}, {}) );
        exportExcel(records, dataSource, dataSourceName);
    } catch(e) {
    	console.error(e.stack);
    	throw e;
    }
}