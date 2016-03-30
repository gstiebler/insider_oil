import express = require("express");
import winston = require('winston');

export function getErrorFunc(res: express.Response, errorCode: number, msg: string) {
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


export function getOkFunc(res: express.Response, msg: string) {
    return function returnOkJson() {
        res.json( { msg: msg } );
    }
}