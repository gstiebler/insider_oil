"use strict"

import fiberTests = require('./lib/fiberTests');
import db = require('../db/models');
var await = require('../lib/await');
var utils = require('./lib/utils');
import nodeunit = require('nodeunit');
import ComboQueries = require('../db/queries/ComboQueries');

function jsonfy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

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
    const statoilId = utils.idByName('Company', 'Statoil');
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
    // TODO test saving not summing 100%
    /*try {
	    await( db.sequelize.transaction(function(t) {
            return db.models.OilField.create(newItemData);
        }));
        test.ok(false);
    } catch(err) {
        console.log(err);
    }
    newItemData.concessionaries_props = [ 30, 70 ]; */
    const newRecord = await( db.models.OilField.create(newItemData) );
    
    // Create
    const findOpts = { where: { name: 'Campo Teste' } };
    const record = jsonfy(newRecord);
    
    test.equal( 2, record.concessionaries.length );
    test.equal( 2, record.concessionaries_props.length );
    test.equal( petroId, record.concessionaries[1].id);
    test.equal( 'Petrobras', record.concessionaries[1].name);
    test.equal( 30, record.concessionaries_props[0]);
    test.equal( 70, record.concessionaries_props[1]);
    test.equal( 'Eni Oil: 30%\nPetrobras: 70%', record.formatted_concessionaries);
    
    // Edit
    newRecord.concessionaries = [ { id: statoilId } ];
    newRecord.concessionaries_props = [100];
    await( newRecord.save() );
    const recAfterSave = jsonfy( await( db.models.OilField.findAll(findOpts) )[0] );
    
    test.equal( 1, recAfterSave.concessionaries.length );
    test.equal( 1, recAfterSave.concessionaries_props.length );
    test.equal( statoilId, recAfterSave.concessionaries[0].id);
    test.equal( 'Statoil', recAfterSave.concessionaries[0].name);
    test.equal( 100, recAfterSave.concessionaries_props[0]);
    
    // Delete
    const oilFieldId = newRecord.id;
    db.models.OilField.destroy( { where: { id: oilFieldId } } );
    const delFindOpts = { where: { oil_field_id: oilFieldId } };
    const recAfterDel = await( db.models.OilFieldConcessionary.findAll(delFindOpts) );
    test.equal( 0, recAfterDel.length );
    
    test.done();
},

GasPipeline: (test) => {
    const gpId = utils.idByName('GasPipeline', 'GASODUTO LOR/UPN');
    const gp = jsonfy( await( db.models.GasPipeline.findById(gpId) ) );

    test.equal('Plataforma de Produção de Ubarana 2', gp.src_instalation_text);  
    test.equal('Campo de Produção de Ubarana', gp.src_concession_text);  
    test.equal('Capixaba', gp.dst_instalation[0].name); 
    test.equal('Jiribatuba2', gp.dst_concession[0].name);
       
    test.done();
},

Contract: (test) => {
    const obj = { supplier: 'supplier' };
    await( db.models.Contract.create(obj) );
    const searchOpt = { where: obj };
    const lastRecord = await( db.models.Contract.findOne(searchOpt) );
    const refObj:any[] = lastRecord.object;
    test.equal(0, refObj.length);
       
    test.done();
}

}

exports.group = fiberTests.convertTests( group, false );