import fs = require('fs');
import path = require('path');
import { IBaseDataSourceParams } from '../../../common/Interfaces';
const basename = path.basename(module.filename);

import AmbientalLicense = require('./AmbientalLicense');

interface IParams {
    [name: string]: IBaseDataSourceParams;
}

let params:IParams = {};

params['AmbientalLicense'] = require('./AmbientalLicense');
params['Basin'] = require('./Basin');
params['Block'] = require('./Block');
params['ComercialDeclaration'] = require('./ComercialDeclaration');
params['Company'] = require('./Company');
params['DrillingRigOffshore'] = require('./DrillingRigOffshore');
params['DrillingRigOnshore'] = require('./DrillingRigOnshore');
params['News'] = require('./News');
params['OilField'] = require('./OilField');
params['Person'] = require('./Person');
params['Production'] = require('./Production');
params['Reserve'] = require('./Reserve');
params['Seismic'] = require('./Seismic');
params['Well'] = require('./Well');
params['HydrocarbonEvidence'] = require('./HydrocarbonEvidence');
params['ProductionUnit'] = require('./ProductionUnit');
params['Refinery'] = require('./Refinery');
params['Terminal'] = require('./Terminal');
params['Fleet'] = require('./Fleet');
params['Bid'] = require('./Bid');
params['Contract'] = require('./Contract');
params['GasPipeline'] = require('./GasPipeline');
params['OilPipeline'] = require('./OilPipeline');
params['GasMovement'] = require('./GasMovement');
params['IndustrySegment'] = require('./IndustrySegment');
params['MaintenanceDate'] = require('./MaintenanceDate');
params['ExcelImportLog'] = require('./ExcelImportLog');
params['ErrorReport'] = require('./ErrorReport');
params['User'] = require('./User');

export = params;



