"use strict";
var fiberTests = require('./lib/fiberTests');
var news = require('../lib/News');


var group = {

modelReferences: test => {
	const newsHTML = '<p>um campo: <a href="/app/view_record?source=OilField&amp;id=3" style="background-color: rgb(255, 255, 255);">Abalone</a> ' +
		'esse aqui é o google <a href="http://google.com" target="" style="background-color: rgb(255, 255, 255);">' + 
		'Google</a> link de verdade e aqui um nome: </p><p><a href="/app/view_record?source=Person&amp;id=1" style="background-color: rgb(255, 255, 255);">' + 
		'Guilherme Stiebler</a></p>';
	
	const references = news.getModelReferences(newsHTML);
	test.equal(2, references.length);
	test.equal('OilField', references[0].model);
	test.equal(3, references[0].id);
	test.equal('Person', references[1].model);
	test.equal(1, references[1].id);
	test.done();
}

};


fiberTests.convertTests( exports, group );