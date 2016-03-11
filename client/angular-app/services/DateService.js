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
        const strParts = dateStr.substring(0, 10).split('-');;
        return strParts[2] + '/' + strParts[1] + '/' + strParts[0];
    }
    
    /**
     * Formats date-time string
     * @param {String} dateTimeStr 
     * @return {String} Formatted date string
     */
    this.parseDateTime = function(dateTimeStr) {
    	const date = new Date(dateTimeStr);
    	return date.toLocaleString();
    }

});