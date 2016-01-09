"use strict";
const newsLib = require('../../lib/News');
var Sync = require('Sync');
var await = require('../../lib/await');


function afterCreate(db) {	
	db.News.hook('afterCreate', function(news, options) {
		var error = false;
		Sync( function() {
			const referencedObjects = newsLib.getModelReferences(news.content);
			for(var i = 0; i < referencedObjects.length; i++) {
				const referencedObj = referencedObjects[i];
				const findOptions = { where: { name: referencedObj.model } };
				const modelId = await( db.ModelsList.findOne(findOptions) ).id;
		    	const newsRefObj = {
		    		news_id: news.id,
		    		model_ref_id: referencedObj.id,
		    		model_id: modelId
		    	};
		    	await( db.NewsModels.create(newsRefObj) );
			}
		}, function(err, result){ 
		    if (err) 
		    	console.error(err.stack); // something went wrong
		    error = err;
		});
		
		if(error)
			throw error;
	});
}

module.exports = function(sequelize, DataTypes) {
	var News = sequelize.define('News', {
		title: {
			type: DataTypes.STRING,
			allowNull: false
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		author_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	}, 
	{
		underscored: true,
		tableName: 'news',
		classMethods: {
			associate: function(models) {
				News.belongsTo(models.User, { as: 'author' });
			},
			defineHooks: afterCreate
		}
	});



	return News;
};