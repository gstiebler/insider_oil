import utils = require('../lib/utils');

module.exports = function(db) {
    return db.models.IndustrySegment.bulkCreate([
        {
            name: 'Petróleo'
        },
        {
            name: 'Gás'
        },
    ]);
}