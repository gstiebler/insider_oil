'use strict';

var await = require('../lib/await');
import db = require('../db/models');
var Sync = require('sync');
var dsParams = require('../lib/DataSourcesParams');
import winston = require('winston');

 const dataSources:any = [
    {
        model: 'Block',
        fields: ['name', 'name_contract']
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
    },
    {
        model: 'Basin',
        fields: ['name']
    },
    {
        model: 'ProductionUnit',
        fields: ['name']
    },
    {
        model: 'Refinery',
        fields: ['name']
    },
    {
        model: 'Terminal',
        fields: ['name']
    },
    {
        model: 'Fleet',
        fields: ['name']
    },
    {
        model: 'GasPipeline',
        fields: ['name']
    },
];

// add ids to dataSources
Sync(function() {
    for(var i = 0; i < dataSources.length; i++) {
        const searchOptions = { where: { name: dataSources[i].model } };
        const modelItem = await( db.models.ModelsList.findOne(searchOptions) );
        dataSources[i].model_id = modelItem.id;
    }
});


function search(searchValue, numMaxResults) {
    const searchStr = '%' + searchValue + '%';
    var queryStrings = [];
    for( var i = 0; i < dataSources.length; i++) {
    	const dataSource = dataSources[i];
    	for( var j = 0; j < dataSource.fields.length; j++ ) {
    		const model = db.models[dataSource.model];
    		const fieldName = dataSource.fields[j];
    		var currQuery = 'select ' + fieldName + ' as name, "' + dataSource.model + '" as model, ' + dataSource.model_id + ' as model_id, id ';
            currQuery += ' from ' + model.getTableName();
    		currQuery += ' where ' + fieldName + ' like "' + searchStr + '"';
    		queryStrings.push(currQuery);
    		queryStrings.push('\n union \n')
    	}
    }
    
    queryStrings[queryStrings.length - 1] = '\n limit ' + numMaxResults;
    const queryStr = queryStrings.join('');
    const simpleQueryType = { type: db.sequelize.QueryTypes.SELECT};
    return db.sequelize.query(queryStr, simpleQueryType);
}


exports.main = function(req, res) {
	const MAX_NUM_RESULTS = 5;
    const searchValue = req.query.searchValue;
   
    search(searchValue, MAX_NUM_RESULTS).then(onResults).catch(function(error){
        winston.error(error.stack);
    });
    function onResults(queryResults) {
    	var results = [];
		for( var n = 0; n < queryResults.length; n++ ) {
			const result = queryResults[n];
			const modelParams = dsParams[result.model];
			results.push({
				model: result.model,
				modelLabel: modelParams.tableLabel,
				name: result.name,
				id: result.id,
                model_id: result.model_id
			});
		}
        res.json(results);
        return null;
    }
};
