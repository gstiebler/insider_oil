"use strict"

import fiberTests = require('./lib/fiberTests');
import db = require('../db/models');
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
    const firstWell = await( db.models.Well.findById( firstId ) );
    const comboItems = getComboItems();
    firstWell.drilling_rig = comboItems[0].id;
    await( firstWell.save() ); 
    const well2 = await( db.models.Well.findById( firstId ) );
    test.equal( idOffshore + ':offshore', well2.drilling_rig );
    test.done();
},


oilFieldConcessionaries: function(test) {
    const petroId = utils.idByName('Company', 'Petrobras');
    const newItemData = {
        name: 'Campo Teste',
        basin_id: utils.idByName('Basin', 'Tucano Central'),
        state: 'Bahia',
        shore: 'on',
        stage: 'production',
        concessionaries: 
            [ { id: utils.idByName('Company', 'Eni Oil')  },
            { id: petroId } ],
        concessionaries_props: [ 30, 70 ],
    };
    await( db.models.OilField.create(newItemData) );
    
    const findOpts = { where: { name: 'Campo Teste' } };
    const newRecord = await( db.models.OilField.findAll(findOpts) );
    const record = JSON.parse(JSON.stringify(newRecord));
    
    test.equal( petroId, record[0].concessionaries[1].id);
    test.equal( 'Petrobras', record[0].concessionaries[1].name);
    test.equal( 30, record[0].concessionaries_props[0]);
    test.equal( 70, record[0].concessionaries_props[1]);
    
    test.done();
},


}

exports.group = fiberTests.convertTests( group, false );