"use strict"

import fiberTests = require('./lib/fiberTests');
import db = require('../db/models');
import { await } from '../lib/await';
var utils = require('./lib/utils');
import nodeunit = require('nodeunit');
import ComboQueries = require('../db/queries/ComboQueries');
import { IFrontEndProject } from '../../common/Interfaces';

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
    test.equal( 0.3, record.concessionaries[0].prop);
    test.equal( 30, record.concessionaries_props[0]);
    test.equal( 0.7, record.concessionaries[1].prop);
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

blockConcessionaries: function(test) {
    const petroId = utils.idByName('Company', 'Petrobras');
    const statoilId = utils.idByName('Company', 'Statoil');
    const newItemData = {
        name: 'Bloco Teste',
        basin_id: utils.idByName('Basin', 'Tucano Central'),
        operator_id: utils.idByName('Company', 'Petrobras'),
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
    const newRecord = await( db.models.Block.create(newItemData) );
    
    // Create
    const record = jsonfy(newRecord);
    
    test.equal( 2, record.concessionaries.length );
    test.equal( 2, record.concessionaries_props.length );
    test.equal( petroId, record.concessionaries[1].id);
    test.equal( 'Petrobras', record.concessionaries[1].name);
    test.equal( 0.3, record.concessionaries[0].prop);
    test.equal( 30, record.concessionaries_props[0]);
    test.equal( 0.7, record.concessionaries[1].prop);
    test.equal( 70, record.concessionaries_props[1]);
    test.equal( 'Eni Oil: 30%\nPetrobras: 70%', record.formatted_concessionaries);
    
    // Edit
    newRecord.concessionaries = [ { id: statoilId } ];
    newRecord.concessionaries_props = [100];
    await( newRecord.save() );
    const findOpts = { where: { name: 'Bloco Teste' } };
    const recAfterSave = jsonfy( await( db.models.Block.findAll(findOpts) )[0] );
    
    test.equal( 1, recAfterSave.concessionaries.length );
    test.equal( 1, recAfterSave.concessionaries_props.length );
    test.equal( statoilId, recAfterSave.concessionaries[0].id);
    test.equal( 'Statoil', recAfterSave.concessionaries[0].name);
    test.equal( 100, recAfterSave.concessionaries_props[0]);
    
    // Delete
    const blockId = newRecord.id;
    db.models.Block.destroy( { where: { id: blockId } } );
    const delFindOpts = { where: { block_id: blockId } };
    const recAfterDel = await( db.models.BlockConcessionary.findAll(delFindOpts) );
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
    const amazonId = utils.idByName('Basin', 'Amazonas'); 
    const basinId = utils.idByName('ModelsList', 'Basin');
    const projectsToCreate:IFrontEndProject[] =[
        {
            model_id:basinId ,
            id: amazonId,
            description: 'project 1'
        },
        {
            model_id: utils.idByName('ModelsList', 'Block'),
            id: utils.idByName('Block', 'BM-BAR-1'),
        },
    ] 
    const obj = {
        user_uid: '304958',
        supplier: 'supplier',
        projects: projectsToCreate
    };
    await( db.models.Contract.create(obj) );
    const searchOpt = { where: { user_uid: obj.user_uid } };
    const lastRecord = await( db.models.Contract.findOne(searchOpt) );
    const projects:IFrontEndProject[] = lastRecord.projects;
    test.equal(2, projects.length);
    test.equal('project 1', projects[0].description);
    test.equal(amazonId, projects[0].id);
    test.equal(basinId, projects[0].model_id);
       
    const fixtureContract99 = await( db.models.Contract.findOne({ where: {user_uid: '99'} }) );
    test.equal(22, fixtureContract99.duration);
    test.equal(797913.170909091, fixtureContract99.day_rate);
    test.equal('G&E MANUTENCAO E SERVICOS LTDA', fixtureContract99.supplier_formatted);

    const fixtureContract300 = await( db.models.Contract.findOne({ where: {user_uid: '300'} }) );
    test.equal(null, fixtureContract300.day_rate);
    test.equal('Queiroz Galvão', fixtureContract300.supplier_formatted);

    test.done();
}

}

var notModGroup: nodeunit.ITestGroup = {

BlockCoords: (test) => {
const coordsStrs = [
        '-20,    -40',
        '-22.0001000, -41.0003   ',
        '  -20.0,  -44   ',
        '*',
        '-22.0000, -39.3   ',
        '  -22.0,  -38   ',
    ];
    const coordsStr = coordsStrs.join('\n');
    const block = db.models.Block.build({
        name: 'teste',
        polygons_admin: coordsStr
    });

    const expectedStr = '-20, -40\n-22.0001, -41.0003\n-20, -44\n*\n-22, -39.3\n-22, -38';
    test.equal(expectedStr, block.polygons_admin);
    test.done();
}

}

exports.notModDBGroup = fiberTests.convertTests( notModGroup, true );
exports.group = fiberTests.convertTests( group, false );