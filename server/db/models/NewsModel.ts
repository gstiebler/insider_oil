"use strict";
import newsLib = require('../../lib/News');

namespace News {
    
var db:any = {};

function setReferences(news, options) {	
    const referencedObjects = newsLib.getModelReferences(news.content);
    
    return db.NewsModels.destroy({ where: { news_id: news.id } }).then(createRefs);
    
    function createRefs() {
        const promiseModelIdArray = [];
        // gets the ids from the models in ModelsList
        for(var i = 0; i < referencedObjects.length; i++) {
            const referencedObj = referencedObjects[i];
            const findOptions = { where: { name: referencedObj.model } };
            promiseModelIdArray.push(db.ModelsList.findOne(findOptions));
        }
        
        return Promise.all(promiseModelIdArray).then(onModelIds);     
    }
    
    function onModelIds(modelIds) {
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
    }
    
}


function defineHooks(DB) {
    db = DB;
	db.News.hook('afterCreate', setReferences);
	db.News.hook('beforeUpdate', setReferences);
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
			defineHooks: defineHooks
		}
	});



	return News;
};
   
}