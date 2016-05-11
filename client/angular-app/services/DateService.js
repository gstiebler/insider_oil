'use strict';
var app = angular.module('InsiderOilApp');

app.service('DateService',  function() {
    
    /**
     * Formats date string in the format yyyy-mm-dd to dd/mm/yyyy
     * @param {String} dateStr 
     * @return {String} Formatted date string
     */
    this.dateFormat = function(dateStr) {
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
    this.parseDateTime = function(dateTimeStr) {
        var result = moment(dateTimeStr).format('DD/MM/YYYY HH:mm');
        return result;
    }

});