"use strict";
var db  = require('../db/models');


exports.main = function(req, res) {
	const options = { order: [['created_at', 'DESC']] };
    db.News.findAll(options).then(sendNews);
    
    function sendNews(news) {
    	res.json(news);
    }
}