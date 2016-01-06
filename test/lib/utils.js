var await = require('../../lib/await');
var db = require('../../db/models');

exports.idByName = function(modelName, value) {
    const model = db[modelName];
    return await( model.findOne( { where: { name: value }} ) ).id;
}