var fiberTests = require('./lib/fiberTests');
var utils = require('./lib/utils');
import nodeunit = require('nodeunit');
import dbServerController = require('../controllers/dbServerController');

var group: nodeunit.ITestGroup = {


newsFromObject:  (test: nodeunit.Test) => {
    const abaloneId = utils.idByName('OilField', 'Abalone');
    const filters = {
        modelName: 'OilField',
        id: abaloneId
    };
    const reqQueryValues = {
        query: { 
            queryName: 'NewsByObject',
            filters: JSON.stringify(filters)
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(1, resQueryValues.records.length);    
    test.equal('Petrobrás compra Statoil', resQueryValues.records[0].title);
    test.equal('News', resQueryValues.records[0].model);
  
    // adding more news from this oil field
    const newNews = {
        title: 'adicionando notícia',
        content: '<p>outra notícia: <a href="/app/view_record?source=OilField&amp;id=' + abaloneId + '" style="background-color: rgb(255, 255, 255);">Abalone</a> ',
        author_id: 1
    };
    const reqNewNews = {
        body: { 
            model: 'News',
            newItemData: newNews
        }
    };
    utils.getJsonResponse.sync(null, dbServerController.createItem, reqNewNews);

	// should have 2 news from this oil field now
    const moreNewsFromObject = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(2, moreNewsFromObject.records.length);

    // testing with an invalid id
    filters.id = 5450;
    reqQueryValues.query.filters = JSON.stringify(filters);
    const newsResultsWrongId = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(0, newsResultsWrongId.records.length);

    test.done();
},


getPersonsByProject:  (test: nodeunit.Test) => {
    const amazonasId = utils.idByName('Basin', 'Amazonas') ;
    const filters = {
        project_id: amazonasId,
        dataSource: 'Basin'
    };
    const reqQueryValues = {
        query: { 
            queryName: 'PersonsByProject',
            filters: JSON.stringify(filters)
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(1, resQueryValues.records.length);
    const record = resQueryValues.records[0];
    test.equal('Guilherme Stiebler', record.name);
    test.equal('diretor', record.description);
    test.equal('Person', record.model);
    
    test.equal('Nome', resQueryValues.fields[0].label);
    test.equal('model', resQueryValues.fields[0].ref.modelField);
    test.equal('id', resQueryValues.fields[0].ref.idField);
    test.equal('name', resQueryValues.fields[0].ref.valueField);
    
    test.equal('Cargo', resQueryValues.fields[1].label);
    test.equal('position', resQueryValues.fields[1].fieldName);
    test.equal('VARCHAR', resQueryValues.fields[1].type);

    test.done();
},


getAmbientalLicensesByBlock:  (test: nodeunit.Test) => {
    const bmbarId = utils.idByName('Block', 'BM-BAR-1') ;
    const filters = {
        id: bmbarId,
    };
    const reqQueryValues = {
        query: { 
            queryName: 'ambientalLicenseByBlock',
            filters: JSON.stringify(filters)
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(2, resQueryValues.records.length);
    
    const record = resQueryValues.records[0];
    test.equal('ABio 560/2014', record.license);
    test.equal('BP ENERGY DO BRASIL LTDA', record.entrepreneur);
    test.equal('AmbientalLicense', record.model);
    
    test.equal('Nro da licença', resQueryValues.fields[0].label);
    test.equal('model', resQueryValues.fields[0].ref.modelField);
    test.equal('id', resQueryValues.fields[0].ref.idField);
    test.equal('license', resQueryValues.fields[0].ref.valueField);
    
    test.equal('Emissão', resQueryValues.fields[1].label);
    test.equal('start', resQueryValues.fields[1].fieldName);
    test.equal('DATE', resQueryValues.fields[1].type);

    test.done();
},


getComercialDeclarationsByBlock:  (test: nodeunit.Test) => {
    const bmbarId = utils.idByName('Block', 'BM-BAR-1') ;
    const filters = {
        id: bmbarId,
    };
    const reqQueryValues = {
        query: { 
            queryName: 'comercialDeclarationsByBlock',
            filters: JSON.stringify(filters)
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(1, resQueryValues.records.length);
    
    const record = resQueryValues.records[0];
    test.equal('NÃO', record.attached);
    
    test.equal('Anexado', resQueryValues.fields[0].label);
    test.equal('model', resQueryValues.fields[0].ref.modelField);
    test.equal('id', resQueryValues.fields[0].ref.idField);
    test.equal('attached', resQueryValues.fields[0].ref.valueField);
    
    test.equal('Data', resQueryValues.fields[1].label);
    test.equal('date', resQueryValues.fields[1].fieldName);
    test.equal('DATE', resQueryValues.fields[1].type);

    test.done();
},


getWellsByBlock:  (test: nodeunit.Test) => {
    const bmbarId = utils.idByName('Block', 'BM-BAR-1') ;
    const nicId = utils.idByName('DrillingRigOnshore', 'NIC-01');
    const abanId = utils.idByName('DrillingRigOffshore', 'Aban Abraham');
    const filters = {
        id: bmbarId,
    };
    const reqQueryValues = {
        query: { 
            queryName: 'wellsByBlock',
            filters: JSON.stringify(filters)
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getQueryData, reqQueryValues);
    test.equal(2, resQueryValues.records.length);
    
    const recordOnshore = resQueryValues.records[0];
    test.equal('1A 0001 BA', recordOnshore.well_name);
    test.equal('Well', recordOnshore.model);
    test.equal('DrillingRigOnshore', recordOnshore.drilling_rig_model);
    test.equal(nicId, recordOnshore.drilling_rig_id);
    test.equal('NIC-01', recordOnshore.drilling_rig_name);
    
    const recordOffshore = resQueryValues.records[1];
    test.equal('1AJ 0001 BA', recordOffshore.well_name);
    test.equal('Well', recordOffshore.model);
    test.equal('DrillingRigOffshore', recordOffshore.drilling_rig_model);
    test.equal(abanId, recordOffshore.drilling_rig_id);
    test.equal('Aban Abraham', recordOffshore.drilling_rig_name);
    
    test.equal('Nome', resQueryValues.fields[0].label);
    test.equal('model', resQueryValues.fields[0].ref.modelField);
    test.equal('id', resQueryValues.fields[0].ref.idField);
    test.equal('well_name', resQueryValues.fields[0].ref.valueField);
    
    test.equal('Início', resQueryValues.fields[1].label);
    test.equal('start', resQueryValues.fields[1].fieldName);
    test.equal('DATE', resQueryValues.fields[1].type);
    
    test.equal('Sonda', resQueryValues.fields[2].label);
    test.equal('drilling_rig_model', resQueryValues.fields[2].ref.modelField);
    test.equal('drilling_rig_id', resQueryValues.fields[2].ref.idField);
    test.equal('drilling_rig_name', resQueryValues.fields[2].ref.valueField);

    test.done();
},


}

fiberTests.convertTests( exports, group );