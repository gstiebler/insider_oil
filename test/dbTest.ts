var fiberTests = require('./lib/fiberTests');
var db = require('../db/models');
var await = require('../lib/await');
var utils = require('./lib/utils');
import nodeunit = require('nodeunit');

var group: nodeunit.ITestGroup = {

updateWell: (test: nodeunit.Test) => {
    const idOffshore = utils.idByName('DrillingRigOffshore', 'Aban Abraham');
    const firstId = utils.idByName('Well', '1A 0001 BA');
    const Well = db.Well;
    const firstWell = await( Well.findById( firstId ) );
    firstWell.drilling_rig = idOffshore + ':offshore';
    await( firstWell.save() ); 
    const well2 = await( Well.findById( firstId ) );
    test.equal( idOffshore + ':offshore', well2.drilling_rig );
    test.done();
}

}

fiberTests.convertTests( exports, group );