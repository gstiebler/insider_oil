import utils = require('../lib/utils');
var await = require('../../lib/await');

module.exports = function(db) {
    const data = [
        {
            model: 'Fleet',
            obj_id: 1,
            type: 'EDIT',
            updates: '["weight", "year"]'
        },
        {
            model: 'OilField',
            obj_id: 1,
            type: 'EDIT',
            updates: '["stage", "state"]'
        },
        {
            model: 'Fleet',
            obj_id: 2,
            type: 'EDIT',
            updates: '["country"]'
        },
    ];
    await( db.models.UpdateLog.bulkCreate(data) );
}