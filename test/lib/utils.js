var await = require('../../lib/await');
var db = require('../../db/models');

exports.idByName = function(modelName, value) {
    const model = db[modelName];
    return await( model.findOne( { where: { name: value }} ) ).id;
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