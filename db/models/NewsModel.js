"use strict";
const newsLib = require('../../lib/News');

function afterCreate(db) {	
	db.News.hook('afterCreate', function(news, options) {
		const referencedObjects = newsLib.getModelReferences(news.content);
		const promiseModelIdArray = [];
		// gets the ids from the models in ModelsList
		for(var i = 0; i < referencedObjects.length; i++) {
			const referencedObj = referencedObjects[i];
			const findOptions = { where: { name: referencedObj.model } };
			promiseModelIdArray.push(db.ModelsList.findOne(findOptions));
		}
		
		return Promise.all(promiseModelIdArray).then( function(modelIds) {
			try {
				const promiseArray = [];
				// insert the records in NewsModels
				for(var i = 0; i < referencedObjects.length; i++) {
					const referencedObj = referencedObjects[i];
					const modelId = modelIds[i].id;
			    	const newsRefObj = {
			    		news_id: news.id,
			    		model_ref_id: referencedObj.id,
			    		model_id: modelId
			    	};
			    	promiseArray.push(db.NewsModels.create(newsRefObj, { transaction: options.transaction }));
				}
				return Promise.all(promiseArray);
			} catch(e) {
				return db.sequelize.Promise.reject(e.stack)
			}
		});
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
				News.hasMany(models.NewsModels, { onDelete: 'cascade' });
			},
			defineHooks: afterCreate
		}
	});



	return News;
};