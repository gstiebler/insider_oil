import db = require('../../db/models');
import { await } from '../../lib/await';

export function createFixtures():void {
    await( require('../../db/seeders/ModelsListInitializer')(db) );
    await( require('./User')(db) );
    await( require('./Company')(db) );
    await( require('./Refinery')(db) );
    await( require('./Terminal')(db) );
    await( require('./Fleet')(db) );
    await( require('./Basin')(db) );
    await( require('./Block')(db) );
    await( require('./DrillingRigOffshore')(db) );
    await( require('./DrillingRigOnshore')(db) );
    require('./Person')(db);
    require('./OilField')(db);
    await( require('./Seismic')(db) );
    await( require('./AmbientalLicense')(db) );
    await( require('./Reserve')(db) );
    require('./NewsFixtures')(db);
    await( require('./ComercialDeclarationFixture')(db) );
    await( require('./ProductionUnit')(db) );
    require('./Well')(db);
    await( require('./HydrocarbonEvidence')(db) );
    await( require('./GasPipeline')(db) );
    await( require('./OilPipeline')(db) ); 
    await( require('./GasMovement')(db) );
    await( require('./Production')(db) ); 
    require('./IndustrySegment')(db);
    await( require('./Bid')(db) );
    require('./Contract')(db);
    await( require('./MaintenanceDates')(db) );
    await( require('./ErrorReport')(db) );
    await( require('./ExcelImportLog')(db) );
    await( require('./InsightsPublisher')(db) );
    require('./UpdateLog')(db);

    for(var i = 1; i <= 3; i++) {
        const company = await( db.models.Company.findById(i) );
        company.main_person_id = i; 
        await( company.save() );
    }
};