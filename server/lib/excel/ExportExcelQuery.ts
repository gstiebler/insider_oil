var XLSX = require('xlsx');
import winston = require('winston');
import { IBaseQueryField } from '../../../common/Interfaces';

function Workbook():void {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}

export function exportToExcel(records: any[], 
                              fields: IBaseQueryField[], 
                              complete: boolean):any {
    const wb = new Workbook();

	const ws = {};
	const range = {
        s: { c: 0, r: 0 },
        e: { c: fields.length, r: records.length + 2 }
    };

    for(let c = 0; c < fields.length; c++) {
		const cell_ref = XLSX.utils.encode_cell({ c, r: 0 });
        const cell = { v: fields[c].label };
        ws[cell_ref] = cell;
    }

    const numRows = complete ? records.length : 10;
	for(let r = 0; r < numRows; ++r) {
        const row = records[r];
        for(let c = 0; c < fields.length; c++) {
			const cell_ref = XLSX.utils.encode_cell({ c, r: r + 1 });
            let fieldName = fields[c].fieldName;
            if(!fieldName) {
                fieldName = fields[c].ref.valueField;
            }
            const value = row[fieldName];
			const cell = { v: value };
			ws[cell_ref] = cell;
        }
	}

    if(!complete) {
		const cell_ref = XLSX.utils.encode_cell({ c: 0, r: numRows + 2 });
        const cell = { v: 'Para não assinantes, são exportados os primeiros 10 itens' };
        ws[cell_ref] = cell;
    }

	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);

    const ws_name = 'Pasta principal';
    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;

    var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };
    return XLSX.write(wb,wopts);
}