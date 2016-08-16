"use strict";

import * as newsLib from '../../lib/News';
import * as AWS from '../../lib/AWS';
import { resample }  from '../../lib/ImageProcessing';
import { syncify } from '../../lib/PromiseUtils';
var await = require('../../lib/await');

var db:any = {};

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

function setReferences(news, options) {	
    // delete all previous associated models
    await( db.NewsModels.destroy({ where: { news_id: news.id } }) );

    const referencedObjects = newsLib.getModelReferences(news.content);
    // save model references
    
    
    for(var i = 0; i < referencedObjects.length; i++) {
        const referencedObj = referencedObjects[i];
        const findOptions = { where: { name: referencedObj.model } };
        const modelId = await( db.ModelsList.findOne(findOptions) ).id;
        
        const newsRefObj = {
            news_id: news.id,
            model_ref_id: referencedObj.id,
            model_id: modelId
        };
        
        await( db.NewsModels.create(newsRefObj, { transaction: options.transaction }) );
    }
    
    // if the record has image, save all images resolutions on AWS
    if(news.image) {
        for(let imageParam of imageParams) {
            const imgBuffer = new Buffer(news.image);
            const resampledBuffer:Buffer = await( resample(imgBuffer, imageParam.width, imageParam.height) );

            const fileName = 'images/' + newsLib.formatImgUrl(news.id, imageParam.size);
            AWS.saveImage(resampledBuffer, fileName);  
        }
    }
}

function syncifySaveHook(news, options) {
    return syncify(setReferences.bind(null, news, options))
}

function defineHooks(DB) {
    db = DB;
	db.News.hook('afterCreate', syncifySaveHook);
	db.News.hook('beforeUpdate', syncifySaveHook);
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