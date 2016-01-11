"use strict";
var db  = require('../db/models');
var ControllerUtils = require('../lib/ControllerUtils');
var dataSources = require('../lib/DataSources');


exports.allNews = function(req, res) {
	const options = { order: [['created_at', 'DESC']] };
    db.News.findAll(options)
    	.then(sendNews)
    	.catch(ControllerUtils.getErrorFunc(res, 500, "Erro"));
    
    function sendNews(news) {
    	res.json(news);
    }
}


exports.newsFromObject = function(req, res) {
    const sourceName = req.query.sourceName;
    const id = req.query.id;
    
    var modelName = sourceName;
    const source = dataSources[sourceName];
    if(source)
    	modelName = source.model.name;
    
    const modelIdQuery = 'select id from models_list where name = "' + modelName + '" group by id';
    const newsIdQuery = 'SELECT news_id FROM news_models ' +
    	' where model_id = (' + modelIdQuery + ')' +
    	' and model_ref_id = ' + id;
    const newsQuery = 'select * from news ' +
    	' where id in (' + newsIdQuery + ')';
    
    db.sequelize.query(newsQuery)
    	.then(sendNews)
    	.catch(ControllerUtils.getErrorFunc(res, 500, "Erro"));
    
    function sendNews(news) {
    	res.json(news[0]); // WHY the zero??
    }
}