var await = require('../../lib/await');
import db = require('../../db/models');


export function idByValue(modelName: string, fieldName: string, value): number {
    const model = db.models[modelName];
    const filter = {};
    filter[fieldName] = value;
    const record = await( model.findOne( { where: filter } ) );
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