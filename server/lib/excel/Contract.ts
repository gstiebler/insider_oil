"use strict";

import { ImportExcel } from './ImportExcelClass';
import search = require('../search');
const await = require('../await');

export class Contract extends ImportExcel {
    
    setRecord(record, header:string[], fields, rowValues, model) {
        super.setRecord(record, header, fields, rowValues, model);
        this.setObject(record, header, rowValues);
    }

    setObject(record, header, rowValues) {
        const objectStr = this.valueFromHeaderName(rowValues, header, 'objeto');
        const searchResult:any[] = await( search.searchEqual(objectStr, 1) );
        if(searchResult.length == 0) {
            record.object = [];
        } else {
            record.object = searchResult;
        }
    }

    valueFromHeaderName(rowValues, header:string[], columnTitle:string):any {
        const columnIndex = header.indexOf(columnTitle);
        return rowValues[columnIndex];
    }
}