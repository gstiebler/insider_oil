'use strict';

import winston = require('winston');
import search = require('../lib/search');
import dsParams = require('../lib/DataSourcesParams');
import { IFrontEndProject } from '../../common/Interfaces'
import { Search } from '../../common/NetworkInterfaces'

export function main(req, res) {
	const MAX_NUM_RESULTS = 5;
	const query:Search.req = req.query;
    const searchValue = query.searchValue;
   
    search.searchLike(searchValue, MAX_NUM_RESULTS).then(onResults).catch(function(error){
        winston.error(error.stack);
    });
    function onResults(queryResults) {
    	var results:IFrontEndProject[] = [];
		for( var n = 0; n < queryResults.length; n++ ) {
			const result = queryResults[n];
			const modelParams = dsParams[result.model];
			results.push({
				model: result.model,
				modelLabel: modelParams.tableLabel,
				name: result.name,
				id: result.id,
			});
		}
		const result: Search.res = { values: results }
        res.json(result);
        return null;
    }
};
