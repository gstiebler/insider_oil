"use strict";
var db  = require('../db/models');
var ControllerUtils = require('../lib/ControllerUtils');


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
    const modelName = req.query.modelName;
    const id = req.query.id;
    
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