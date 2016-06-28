import * as moment from 'moment';

/**
 * Formats date string in the format yyyy-mm-dd to dd/mm/yyyy
 * @param {String} dateStr 
 * @return {String} Formatted date string
 */
export function dateFormat(dateStr) {
    if(!dateStr)
        return '';
    var result = moment(dateStr).utcOffset(0).format('DD/MM/YYYY');
    return result;
}


/**
 * Formats date-time string. The date is expected to be in UTC
 * This functions converts from UTC to local time
 * @param {String} dateTimeStr 
 * @return {String} Formatted date string
 */
export function dateTimeFormat(dateTimeStr) {
    if(!dateTimeStr)
        return '';
    var result = moment(dateTimeStr).format('DD/MM/YYYY HH:mm');
    return result;
}