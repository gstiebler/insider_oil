import { await } from '../../lib/await';
import db = require('../../db/models');
import winston = require('winston');

export function idByValue(modelName: string, fieldName: string, value): number {
    const model = db.models[modelName];
    const filter = {};
    filter[fieldName] = value;
    const record = await( model.findOne( { where: filter } ) );
    if(!record) {
        winston.error('Record not found: ', modelName, fieldName, value);
        return -1;
    }
    return record.id;
}


export function idByName(modelName: string, value): number {
    return idByValue(modelName, 'name', value);
}


export function deStringify(json) {
    var str = JSON.stringify(json);
    return JSON.parse(str);
}

export function getJsonResponse(func, req, callback) {
    const res = { 
        json: jsonRes,
        status: status
    };
    func(req, res);
    
    function jsonRes(response) {
        callback(null, deStringify(response) );
    }
    
    function status(code) {
        const result = { 
            json: function(response) { 
                callback(null, { code: code, error: deStringify(response) } );
            } 
        };
        return result;
    }
}

export function compareArray(test, array1, array2) {
    test.equal(array1.length, array2.length);
    for(var i = 0; i < array1.length; i++)
        test.equal( array1[i], array2[i] );
}