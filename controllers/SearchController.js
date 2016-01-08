'use strict';
var db  = require('../db/models');
var await = require('../lib/await');

exports.main = function(req, res) {
	const MAX_NUM_RESULTS = 5;
    const searchValue = req.query.searchValue;
    const dataSources = [
		{
			model: 'AmbientalLicense',
			fields: ['license']
		},
        {
        	model: 'Block',
        	fields: ['name']
        },
        {
        	model: 'Company',
        	fields: ['name']
        },
        {
        	model: 'DrillingRigOffshore',
        	fields: ['name']
        },
        {
        	model: 'DrillingRigOnshore',
        	fields: ['name']
        },
        {
        	model: 'Person',
        	fields: ['name']
        },
        {
        	model: 'FixedUEPProduction',
        	fields: ['name']
        },
        {
        	model: 'FPSOProduction',
        	fields: ['name']
        },
        {
        	model: 'OilField',
        	fields: ['name']
        },
        {
        	model: 'Seismic',
        	fields: ['process']
        },
        {
        	model: 'Well',
        	fields: ['name']
        }
    ];
    var results = [];
    for( var i = 0; i < dataSources.length; i++) {
    	const dataSource = dataSources[i];
    	for( var j = 0; j < dataSource.fields.length; j++ ) {
    		const model = db[dataSource.model];
    		const fieldName = dataSource.fields[j];
    		const options = { 
    			where: { },
    			limit: MAX_NUM_RESULTS - results.length
    		};
            const searchStr = '%' + searchValue + '%';
    		options.where[fieldName] = { $like: searchStr } ;
    		const currentResults = await( model.findAll(options) );
    		for( var n = 0; n < currentResults.length; n++ ) {
    			results.push({
    				model: dataSource.model,
    				name: currentResults[n][fieldName],
    				id: currentResults[n].id
    			});
    		}
    		if(results.length >= MAX_NUM_RESULTS) {
    			res.json(results);
    			return;
    		}
    	}
    }
    res.json(results);
};
