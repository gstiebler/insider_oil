import express = require("express");
import winston = require('winston');

export function getErrorFunc(res: express.Response, errorCode: number, msg: string) {
    return function(error) { 
        if(!error)
            return;
            
        var errors = error.errors ? error.errors : [];
        if((typeof error) == 'string') {
            errors.push( { message: error } );
            winston.error(error);
        }
        const errObj = {
            errorMsg: msg, 
            errors: errors 
        };
        if(error.message) {
            errObj.errorMsg += ' ' + error.message;
        }
        winston.error(error.stack);
        res.status(errorCode).json(errObj)
    };
}


export function getOkFunc(res: express.Response, msg: string) {
    return function returnOkJson() {
        res.json( { msg: msg } );
        return null;
    }
}