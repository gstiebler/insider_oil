var XLSX = require('xlsx');
import winston = require('winston');
import { IBaseQueryField } from '../../../common/Interfaces';

function Workbook():void {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}

export function exportToExcel(records: any[], fields: IBaseQueryField[]):any {
    const wb = new Workbook();

	const ws = {};
	const range = {
        s: { c: 0, r: 0 },
        e: { c: fields.length, r: records.length }
    };
	for(let R = 0; R < records.length; ++R) {
        const row = records[R];
        for(let C = 0; C < fields.length; C++) {
			var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
            let fieldName = fields[C].fieldName;
            if(!fieldName) {
                fieldName = fields[C].ref.valueField;
            }
            const value = row[fieldName];
			const cell = { v: value };
			ws[cell_ref] = cell;
        }
	}
	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);

    const ws_name = 'Pasta principal';
    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;

    var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };
    return XLSX.write(wb,wopts);
}