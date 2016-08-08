"use strict"

import fiberTests = require('./lib/fiberTests');
import db = require('../db/models');
import nodeunit = require('nodeunit');
import * as InsightsController from '../controllers/InsightsController';
import * as ni from '../../common/NetworkInterfaces';
import news = require('../lib/News');
var utils = require('./lib/utils');
var Sync = require('sync');
var await = require('../lib/await');


const newsHTML = '<p>um campo: <a href="/app/view_record?source=OilField&amp;id=3" style="background-color: rgb(255, 255, 255);">Abalone</a> ' +
	'esse aqui é o google <a href="http://google.com" target="" style="background-color: rgb(255, 255, 255);">' + 
	'Google</a> link de verdade e aqui um nome: </p><p><a href="/app/view_record?source=Person&amp;id=1" style="background-color: rgb(255, 255, 255);">' + 
	'Guilherme Stiebler</a></p>';

var group: nodeunit.ITestGroup = {

modelReferences: test => {
    const abaloneId = utils.idByName('OilField', 'Abalone');
    const guilhermeId = utils.idByName('Person', 'Guilherme Stiebler');
	const references = news.getModelReferences(newsHTML);
	test.equal(2, references.length);
	test.equal('OilField', references[0].model);
	test.equal(abaloneId, references[0].id);
	test.equal('Person', references[1].model);
	test.equal(guilhermeId, references[1].id);
	test.done();
},


createNewsOnDB: test => {
    const abaloneId = utils.idByName('OilField', 'Abalone');
    const guilhermeId = utils.idByName('Person', 'Guilherme Stiebler');
    const fixtureCount = 3;
    test.equal( fixtureCount, await( db.models.News.findAll() ).length ); 
	const newsToBeCreated = {
		title: 'Título da nova notícia',
		content: newsHTML,
		author_id: utils.idByName('User', 'Felipe Grandin')
	}

	await( db.models.News.create(newsToBeCreated) );
	const newNews = await( db.models.News.findAll() );

    test.equal( fixtureCount + 1, newNews.length );
    const justCreatedNew = newNews[fixtureCount];
    const justCreatedNewId = justCreatedNew.id;
    test.equal('Título da nova notícia', justCreatedNew.title);
    const options = {
        where: { news_id: justCreatedNewId },
        order: 'id'
    };
	const referencedModelsOnNew = await( db.models.NewsModels.findAll(options) );
	test.equal(2, referencedModelsOnNew.length);
	test.equal('OilField', await( db.models.ModelsList.findById(referencedModelsOnNew[0].model_id) ).name);
	test.equal(abaloneId, referencedModelsOnNew[0].model_ref_id);
	test.equal('Person', await( db.models.ModelsList.findById(referencedModelsOnNew[1].model_id) ).name);
	test.equal(guilhermeId, referencedModelsOnNew[1].model_ref_id);
	
	await(justCreatedNew.destroy());
	const referencedModelsOnDeletedNew = await( db.models.NewsModels.findAll({ where: { news_id: justCreatedNewId } }) );
	test.equal(0, referencedModelsOnDeletedNew.length);
	
	test.done();
},


editNews: test => {
    const camposId = utils.idByName('Basin', 'Campos');
    const newsId = utils.idByValue('News', 'title', 'Petrobrás compra Statoil');

    const record = await( db.models.News.findById(newsId) );
    record.content = '<p>um campo: <a href="/app/view_record?source=Basin&amp;id=' + camposId + '" >Campos</a>';
	await( record.save() );
	const referencedModelsOnNew = await( db.models.NewsModels.findAll({ where: { news_id: newsId } }) );
    test.equal(1, referencedModelsOnNew.length);
	test.equal('Basin', await( db.models.ModelsList.findById(referencedModelsOnNew[0].model_id) ).name);
	test.equal(camposId, referencedModelsOnNew[0].model_ref_id);
	test.done();
},

doNotCreateNewsWhenErrorOnModelsReference: test => {
    const fixtureCount = 3;
	const HTMLcontent = newsHTML + '<a href="/app/view_record?source=Nada&amp;id=80" style="background-color: rgb(255, 255, 255);">Abalone</a>';
	const newsToBeCreated = {
		title: 'Título da nova notícia',
		content: HTMLcontent,
		author_id: utils.idByName('User', 'Felipe Grandin')
	}

	db.sequelize.transaction(function(t) {
		return db.models.News.create(newsToBeCreated, { transaction: t })
				.then(finalizeTest)
				.catch(function(e) {
			t.rollback();
			db.models.News.findAll().then(countNews);
		});
	});
	
	function finalizeTest(news) {
		test.ok(false);
	}
	
	function countNews(news) {
		test.equal(fixtureCount, news.length);
	    test.done();
	}
},

savePublisher: (test: nodeunit.Test) => {
    const querySave:ni.SaveInsights.req = {
		flexSlider: [1, 3, 2],
		section1Articles: [1, 2],
		section2Articles: [3, 2, 1],
		section3Articles: [1, 2],
		section4Articles: [1, 2],
	};
    const saveRes:ni.SaveInsights.res = 
        utils.getJsonResponse.sync(null, InsightsController.saveInsights, { query: querySave });

    const getRes:ni.Insights.res = 
        utils.getJsonResponse.sync(null, InsightsController.getInsights, {});

	test.equal(3, getRes.flexSlider.length);
	test.equal(1, getRes.flexSlider[0].id);
	test.equal(3, getRes.flexSlider[1].id);
	test.equal(2, getRes.flexSlider[2].id);

	const flexSliderItem = getRes.flexSlider[0];
	test.equal('Petrobrás compra Statoil', flexSliderItem.title);
	test.equal('Felipe Grandin', flexSliderItem.author);

	test.done();
}

};

var notModDBGroup:nodeunit.ITestGroup = {

insights: (test: nodeunit.Test) => {
    const res:ni.Insights.res = 
        utils.getJsonResponse.sync(null, InsightsController.getInsights, {});
    test.equal(3, res.section1Articles.length);
    test.equal(3, res.section2Articles.length);
    test.equal(3, res.section3Articles.length);
    test.equal(3, res.section4Articles.length);
    test.equal(3, res.popular.length);
    test.equal(3, res.recent.length);
    test.equal(3, res.flexSlider.length);
    test.done();
}

}

exports.notModDBGroup = fiberTests.convertTests( notModDBGroup, true );
exports.group = fiberTests.convertTests( group, false );