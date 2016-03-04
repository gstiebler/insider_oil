"use strict";

var winston = require('winston');
exports.getErrorFunc = function(res, errorCode, msg) {
    return function(error) { 
        var errors = error.errors ? error.errors : [];
        if((typeof error) == 'string')
            errors.push( { message: error } );
        res.status(errorCode).json( {
            errorMsg: msg, 
            errors: errors 
        } )
        winston.error(error.stack);
    };
}


exports.getOkFunc = function(res, msg) {
    return function returnOkJson() {
        res.json( { msg: msg } );
    }
}