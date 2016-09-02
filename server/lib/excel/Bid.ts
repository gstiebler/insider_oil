"use strict";

import { ImportExcel } from './ImportExcelClass';
import search = require('../search');
import { await } from '../../lib/await';

export class Bid extends ImportExcel {

    setRecord(record, header:string[], fields, rowValues, model) {
        super.setRecord(record, header, fields, rowValues, model);
        this.setOpeningTime(record, header, rowValues);
        this.setObject(record, header, rowValues);
    }
    
    setOpeningTime(record, header, rowValues) {
        const openingTimeIndex = header.indexOf('hora de abertura');
        var dateOpening:Date = record.opening_moment;
        const timeFromExcel = rowValues[openingTimeIndex];
        dateOpening.setUTCHours(0);
        dateOpening.setUTCMinutes(0);
        const dateOpeningMili = dateOpening.getTime();
        const openingTimeUTCInMiliseconds = this.getTimeInMillisecondsFromExcelTime(timeFromExcel, dateOpening);
        record.opening_moment = new Date(dateOpeningMili + openingTimeUTCInMiliseconds);
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