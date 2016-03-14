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
        const result = moment(dateStr).utcOffset(0).format('DD/MM/YYYY');
        return result;
    }
    
    /**
     * Formats date-time string
     * @param {String} dateTimeStr 
     * @return {String} Formatted date string
     */
    this.parseDateTime = function(dateTimeStr) {
        const result = moment(dateTimeStr).utcOffset(0).format('DD/MM/YYYY HH:mm');
        return result;
    }

});