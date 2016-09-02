"use strict";

import { ImportExcel } from './ImportExcelClass';
import search = require('../search');
import { IFrontEndProject } from '../../../common/Interfaces';
import { await } from '../../lib/await';

export class Contract extends ImportExcel {
    
    setRecord(record, header:string[], fields, rowValues, model) {
        super.setRecord(record, header, fields, rowValues, model);
        this.setObject(record, header, rowValues);
    }

    setObject(record, header, rowValues) {
        const objectStr:string = this.valueFromHeaderName(rowValues, header, 'objeto');
        const objects = objectStr.split(',');
        record.projects = []; 
        objects.map((projectStr) => {
            const searchResult:IFrontEndProject[] = await( search.searchEqual(objectStr, 1) );
            if(searchResult.length > 0) {
                record.projects.push(searchResult[0]);
            }
        });
    }

    valueFromHeaderName(rowValues, header:string[], columnTitle:string):any {
        const columnIndex = header.indexOf(columnTitle);
        return rowValues[columnIndex];
    }
}