"use strict";

import { ImportExcel } from './ImportExcelClass';
import moment = require('moment-timezone');

const saoPauloZone = moment.tz.zone('America/Sao_Paulo');

export class Bid extends ImportExcel {


    setRecord(record, header:string[], fields, rowValues, model) {
        super.setRecord(record, header, fields, rowValues, model);

        const openingTimeIndex = header.indexOf('hora de abertura');
        var dateOpening:Date = record['opening_moment'];
        dateOpening.setUTCHours(0);
        dateOpening.setUTCMinutes(0);
        const dateOpeningMili = dateOpening.getTime();
        // Convert all the datetimes to Sao Paulo time zone
        const tzOffsetInMinutes = saoPauloZone.offset(dateOpeningMili);
        const timeFromExcel = rowValues[openingTimeIndex];
        const timeFromExcelInMinutes = timeFromExcel * 24 * 60;
        const openingTimeUTCInMinutes = timeFromExcelInMinutes + tzOffsetInMinutes;
        const openingTimeUTCInMiliseconds = openingTimeUTCInMinutes * 60000;
        record['opening_moment'] = new Date(dateOpeningMili + openingTimeUTCInMiliseconds);
    }
    
}