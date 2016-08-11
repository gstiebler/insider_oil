"use strict";

import * as newsLib from '../../lib/News';
import * as AWS from '../../lib/AWS';
import { resample }  from '../../lib/ImageProcessing';

var db:any = {};

function setReferences(news, options) {	
    const referencedObjects = newsLib.getModelReferences(news.content);
    
    return db.NewsModels.destroy({ where: { news_id: news.id } })
        .then(createRefs)
        .then(onModelIds)
        .then(saveImages);
    
    function createRefs() {
        const promiseModelIdArray = [];
        // gets the ids from the models in ModelsList
        for(var i = 0; i < referencedObjects.length; i++) {
            const referencedObj = referencedObjects[i];
            const findOptions = { where: { name: referencedObj.model } };
            promiseModelIdArray.push(db.ModelsList.findOne(findOptions));
        }
        
        return Promise.all(promiseModelIdArray);     
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
    
    function saveImages() {
        if(!news.image) return;
        
        const imageParams = [
            {
                width: 620,
                height: 350,
                size: 'lg'
            },
            {
                width: 300,
                height: 220,
                size: 'md'
            },
            {
                width: 60,
                height: 60,
                size: 'sm'
            },
        ];

        const promises:Promise<any>[] = [];
        for(let imageParam of imageParams) {
            var imgBuffer = new Buffer(news.image);
            console.log(imageParam.size);
            let resamplePromise = resample(imgBuffer, imageParam.width, imageParam.height)
                .then(save.bind(this, imageParam));
            promises.push(resamplePromise);
        }

        function save(imageParam, resampledBuffer) {
            console.log(imageParam.size);
            let fileName = 'images/' + newsLib.formatImgUrl(news.id, imageParam.size);
            console.log(fileName);
            return AWS.saveImage(resampledBuffer, fileName);  
        }

        return Promise.all(promises);
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
		tableau_url: {
			type: DataTypes.TEXT,
			allowNull: true
		},
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