var db  = require('../../db/models');
var await = require('../../lib/await');


function createFixtures() {
    await( require('./User')(db) );
    await( require('./Company')(db) );
    await( require('./Well')(db) );
    await( require('./DrillingRigOffshore')(db) );
    await( require('./Person')(db) );
    await( require('./OilField')(db) );
};

module.exports = createFixtures;