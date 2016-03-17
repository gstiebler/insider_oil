var await = require('../../lib/await');
var db = require('../../db/models');


function idByValue(modelName, fieldName, value) {
    const model = db[modelName];
    const filter = {};
    filter[fieldName] = value;
    const record = await( model.findOne( { where: filter } ) );
    return record.id;
}


function idByName(modelName, value) {
    return idByValue(modelName, 'name', value);
}


function deStringify(json) {
    var str = JSON.stringify(json);
    return JSON.parse(str);
}

exports.getJsonResponse = function(func, req, callback) {
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


exports.idByName = idByName;
exports.idByValue = idByValue