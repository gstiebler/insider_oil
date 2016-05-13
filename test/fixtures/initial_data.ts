import db = require('../../db/models');

var await = require('../../lib/await');

export function createFixtures():void {
    await( require('../../db/seeders/ModelsListInitializer')(db) );
    await( require('./User')(db) );
    await( require('./Company')(db) );
    await( require('./Refinery')(db) );
    await( require('./Basin')(db) );
    await( require('./Block')(db) );
    await( require('./DrillingRigOffshore')(db) );
    await( require('./DrillingRigOnshore')(db) );
    await( require('./Well')(db) );
    await( require('./Person')(db) );
    await( require('./OilField')(db) );
    await( require('./Seismic')(db) );
    await( require('./AmbientalLicense')(db) );
    await( require('./Reserve')(db) );
    await( require('./NewsFixtures')(db) );
    await( require('./ComercialDeclarationFixture')(db) );
    await( require('./HydrocarbonEvidence')(db) );
    await( require('./ProductionUnit')(db) );
    await( require('./ProductionWell')(db) );
    await( require('./Production')(db) );
};