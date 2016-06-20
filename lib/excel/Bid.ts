"use strict";

import { ImportExcel } from './ImportExcelClass';

export class Bid extends ImportExcel {


    setRecord(record, header:string[], fields, rowValues, model) {
        super.setRecord(record, header, fields, rowValues, model);
        this.setOpeningTime(record, header, rowValues);
    }
    
    setOpeningTime(record, header, rowValues) {
        const openingTimeIndex = header.indexOf('hora de abertura');
        var dateOpening:Date = record['opening_moment'];
        const timeFromExcel = rowValues[openingTimeIndex];
        dateOpening.setUTCHours(0);
        dateOpening.setUTCMinutes(0);
        const dateOpeningMili = dateOpening.getTime();
        const openingTimeUTCInMiliseconds = this.getTimeInMillisecondsFromExcelTime(timeFromExcel, dateOpening);
        record['opening_moment'] = new Date(dateOpeningMili + openingTimeUTCInMiliseconds);
    }
}