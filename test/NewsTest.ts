"use strict";
namespace NewsTest {
    
const fiberTests = require('./lib/fiberTests');
const news = require('../lib/News');
const utils = require('./lib/utils');
var db = require('../db/models');
var await = require('../lib/await');


const newsHTML = '<p>um campo: <a href="/app/view_record?source=OilField&amp;id=3" style="background-color: rgb(255, 255, 255);">Abalone</a> ' +
	'esse aqui é o google <a href="http://google.com" target="" style="background-color: rgb(255, 255, 255);">' + 
	'Google</a> link de verdade e aqui um nome: </p><p><a href="/app/view_record?source=Person&amp;id=1" style="background-color: rgb(255, 255, 255);">' + 
	'Guilherme Stiebler</a></p>';

var group = {

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
    test.equal( fixtureCount, await( db.News.findAll() ).length ); 
	const newsToBeCreated = {
		title: 'Título da nova notícia',
		content: newsHTML,
		author_id: utils.idByName('User', 'Felipe Grandin')
	}

	await( db.News.create(newsToBeCreated) );
	const newNews = await( db.News.findAll() );

    test.equal( fixtureCount + 1, newNews.length );
    const justCreatedNew = newNews[fixtureCount];
    const justCreatedNewId = justCreatedNew.id;
    test.equal('Título da nova notícia', justCreatedNew.title);
    const options = {
        where: { news_id: justCreatedNewId },
        order: 'id'
    };
	const referencedModelsOnNew = await( db.NewsModels.findAll(options) );
	test.equal(2, referencedModelsOnNew.length);
	test.equal('OilField', await( db.ModelsList.findById(referencedModelsOnNew[0].model_id) ).name);
	test.equal(abaloneId, referencedModelsOnNew[0].model_ref_id);
	test.equal('Person', await( db.ModelsList.findById(referencedModelsOnNew[1].model_id) ).name);
	test.equal(guilhermeId, referencedModelsOnNew[1].model_ref_id);
	
	await(justCreatedNew.destroy());
	const referencedModelsOnDeletedNew = await( db.NewsModels.findAll({ where: { news_id: justCreatedNewId } }) );
	test.equal(0, referencedModelsOnDeletedNew.length);
	
	test.done();
},


editNews: test => {
    const camposId = utils.idByName('Basin', 'Campos');
    const newsId = utils.idByValue('News', 'title', 'Petrobrás compra Statoil');

    const record = await( db.News.findById(newsId) );
    record.content = '<p>um campo: <a href="/app/view_record?source=Basin&amp;id=' + camposId + '" >Campos</a>';
	await( record.save() );
	const referencedModelsOnNew = await( db.NewsModels.findAll({ where: { news_id: newsId } }) );
    test.equal(1, referencedModelsOnNew.length);
	test.equal('Basin', await( db.ModelsList.findById(referencedModelsOnNew[0].model_id) ).name);
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
		return db.News.create(newsToBeCreated, { transaction: t }).then(finalizeTest).catch(function(e) {
			db.News.findAll().then(countNews);
		});
	});
	
	function finalizeTest(news) {
		test.ok(false);
	}
	
	function countNews(news) {
		test.equal(fixtureCount, news.length);
	    test.done();
	}
}

};

fiberTests.convertTests( exports, group );

}