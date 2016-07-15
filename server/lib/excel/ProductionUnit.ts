"use strict";

import { ImportExcel } from './ImportExcelClass';
import search = require('../search');
import { IFrontEndProject } from '../../../common/Interfaces';
const await = require('../await');

export class ProductionUnit extends ImportExcel {
    
    setRecord(record, header:string[], fields, rowValues, model) {
        super.setRecord(record, header, fields, rowValues, model);
        this.saveCoordinates(record, header, rowValues);
    }

    private saveCoordinates(record, header, rowValues) {
        const lat:string = this.valueFromHeaderName(rowValues, header, 'latitude');
        const lng:string = this.valueFromHeaderName(rowValues, header, 'longitude');
        record.coordinates = JSON.stringify({ lat, lng });
    }

    private valueFromHeaderName(rowValues, header:string[], columnTitle:string):any {
        const columnIndex = header.indexOf(columnTitle);
        return rowValues[columnIndex];
    }
}