'use strict';
var db  = require('../db/models');
var await = require('../lib/await');


function search(searchValue, dataSources, numMaxResults) {
	var results = [];
    const searchStr = '%' + searchValue + '%';
    var queryStrings = [];
    for( var i = 0; i < dataSources.length; i++) {
    	const dataSource = dataSources[i];
    	for( var j = 0; j < dataSource.fields.length; j++ ) {
    		const model = db[dataSource.model];
    		const fieldName = dataSource.fields[j];
    		var currQuery = 'select ' + fieldName + ' as name, "' + dataSource.model + '" as model, id from ' + model.getTableName();
    		currQuery += ' where ' + fieldName + ' like "' + searchStr + '"';
    		queryStrings.push(currQuery);
    		queryStrings.push('\n union \n')
    	}
    }
    
    queryStrings[queryStrings.length - 1] = '\n limit ' + numMaxResults;
    const queryStr = queryStrings.join('');
    return db.sequelize.query(queryStr);
}


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
    
    search(searchValue, dataSources, MAX_NUM_RESULTS).then(onResults);
    function onResults(queryResults) {
    	var results = [];
		for( var n = 0; n < queryResults[0].length; n++ ) {
			const result = queryResults[0][n];
			results.push({
				model: result.model,
				name: result.name,
				id: result.id
			});
		}
        res.json(results);
    }
};
