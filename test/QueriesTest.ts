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
    
    test.equal('Nome', resQueryValues.fields[0].label);
    test.equal('model', resQueryValues.fields[0].ref.modelField);
    test.equal('id', resQueryValues.fields[0].ref.idField);
    test.equal('name', resQueryValues.fields[0].ref.valueField);
    
    test.equal('Cargo', resQueryValues.fields[1].label);
    test.equal('position', resQueryValues.fields[1].fieldName);
    test.equal('VARCHAR', resQueryValues.fields[1].type);

    test.done();
},

}

fiberTests.convertTests( exports, group );