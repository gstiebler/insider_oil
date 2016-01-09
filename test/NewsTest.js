"use strict";
const fiberTests = require('./lib/fiberTests');
const news = require('../lib/News');
const utils = require('./lib/utils');
var db = require('../db/models');
var await = require('../lib/await');

function timeoutSync(seconds, callback) {
	setTimeout(callback, seconds);
}

const newsHTML = '<p>um campo: <a href="/app/view_record?source=OilField&amp;id=3" style="background-color: rgb(255, 255, 255);">Abalone</a> ' +
	'esse aqui é o google <a href="http://google.com" target="" style="background-color: rgb(255, 255, 255);">' + 
	'Google</a> link de verdade e aqui um nome: </p><p><a href="/app/view_record?source=Person&amp;id=1" style="background-color: rgb(255, 255, 255);">' + 
	'Guilherme Stiebler</a></p>';

var group = {

modelReferences: test => {
	const references = news.getModelReferences(newsHTML);
	test.equal(2, references.length);
	test.equal('OilField', references[0].model);
	test.equal(3, references[0].id);
	test.equal('Person', references[1].model);
	test.equal(1, references[1].id);
	test.done();
},


createNewsOnDB: test => {
    const fixtureCount = 3;
    test.equal( fixtureCount, await( db.News.findAll() ).length ); 
	const newsToBeCreated = {
		title: 'Título da nova notícia',
		content: newsHTML,
		author_id: utils.idByName('User', 'Felipe Grandin')
	}

	await( db.News.create(newsToBeCreated) );
	timeoutSync.sync(null, 100);
	const newNews = await( db.News.findAll() );

    test.equal( fixtureCount + 1, newNews.length );
    const justCreatedNew = newNews[fixtureCount];
    test.equal('Título da nova notícia', justCreatedNew.title);
	const referencedModelsOnNew = await( db.NewsModels.findAll({ where: { news_id: justCreatedNew.id } }) );
	test.equal(2, referencedModelsOnNew.length);
	test.equal('OilField', await( db.ModelsList.findById(referencedModelsOnNew[0].model_id) ).name);
	test.equal(3, referencedModelsOnNew[0].model_ref_id);
	test.equal('Person', await( db.ModelsList.findById(referencedModelsOnNew[1].model_id) ).name);
	test.equal(1, referencedModelsOnNew[1].model_ref_id);
	test.done();
}

};


fiberTests.convertTests( exports, group );