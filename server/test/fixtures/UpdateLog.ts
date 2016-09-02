import utils = require('../lib/utils');
import { await } from '../../lib/await';

module.exports = function(db) {
    const data = [
        {
            model: 'Fleet',
            obj_id: 1,
            type: 'EDIT',
            updates: '["weight", "year"]',
            created_at: '2010-10-17'
        },
        {
            model: 'OilField',
            obj_id: 1,
            type: 'EDIT',
            updates: '["stage", "state"]',
            created_at: '2010-10-18'
        },
        {
            model: 'Fleet',
            obj_id: 2,
            type: 'EDIT',
            updates: '["country"]',
            created_at: '2010-10-20'
        },
    ];
    await( db.models.UpdateLog.bulkCreate(data) );
}