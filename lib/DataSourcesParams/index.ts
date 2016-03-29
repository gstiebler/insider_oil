import fs = require('fs');
import path = require('path');
import BaseDataSourceParams = require('./BaseDataSourceParams');
const basename = path.basename(module.filename);

import AmbientalLicense = require('./AmbientalLicense');

interface IParams {
    [name: string]: BaseDataSourceParams;
}

let params:IParams;

params['AmbientalLicense'] = require('./AmbientalLicense');
params['Basin'] = require('./Basin');
params['Block'] = require('./Block');
params['ComercialDeclaration'] = require('./ComercialDeclaration');
params['Company'] = require('./Company');
params['DrillingRigOffshore'] = require('./DrillingRigOffshore');
params['DrillingRigOnshore'] = require('./DrillingRigOnshore');
params['FixedUEPProduction'] = require('./FixedUEPProduction');
params['FPSOProduction'] = require('./FPSOProduction');
params['News'] = require('./News');
params['OilField'] = require('./OilField');
params['Person'] = require('./Person');
params['Production'] = require('./Production');
params['Reserve'] = require('./Reserve');
params['Seismic'] = require('./Seismic');
params['Well'] = require('./Well');

export = params;



