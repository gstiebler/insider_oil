var fiberTests = require('./lib/fiberTests');
var db = require('../db/models');
var await = require('../lib/await');
var utils = require('./lib/utils');
import nodeunit = require('nodeunit');
import ComboQueries = require('../db/queries/ComboQueries');

var group: nodeunit.ITestGroup = {

updateWell: (test: nodeunit.Test) => {
    function getComboItems() {
        const queryStr = ComboQueries['AllDrillingRigs']();
        const simpleQueryType = { type: db.Sequelize.QueryTypes.SELECT};
        return await( db.sequelize.query(queryStr, simpleQueryType) );
    }
    
    const idOffshore = utils.idByName('DrillingRigOffshore', 'Aban Abraham');
    const firstId = utils.idByName('Well', '1A 0001 BA');
    const firstWell = await( db.Well.findById( firstId ) );
    const comboItems = getComboItems();
    firstWell.drilling_rig = comboItems[0].id;
    await( firstWell.save() ); 
    const well2 = await( db.Well.findById( firstId ) );
    test.equal( idOffshore + ':offshore', well2.drilling_rig );
    test.done();
}

}

fiberTests.convertTests( exports, group );