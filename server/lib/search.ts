
'use strict';

import db = require('../db/models');
import { await } from '../lib/await';

interface IDataSource {
    model: string;
    fields: string[];
}

const dataSources:IDataSource[] = [
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
    {
        model: 'OilPipeline',
        fields: ['name']
    },
    {
        model: 'Boat',
        fields: ['name']
    },
    {
        model: 'Project',
        fields: ['name']
    },
];

export function searchLike(searchValue, numMaxResults) {
    const searchStr = '%' + searchValue + '%';
    var queryStrings = [];
    for( var i = 0; i < dataSources.length; i++) {
    	const dataSource = dataSources[i];
    	for( var j = 0; j < dataSource.fields.length; j++ ) {
    		const model = db.models[dataSource.model];
    		const fieldName = dataSource.fields[j];
    		var currQuery = 'select ' + fieldName + ' as name, "' + dataSource.model + '" as model, id ';
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

export interface ISearchResult
{
    name: string;
    model: string;
    id: number;
}

export function searchEqual(searchValue, numMaxResults):Promise<ISearchResult[]> {
    var queryStrings = [];
    for( var i = 0; i < dataSources.length; i++) {
    	const dataSource = dataSources[i];
    	for( var j = 0; j < dataSource.fields.length; j++ ) {
    		const model = db.models[dataSource.model];
    		const fieldName = dataSource.fields[j];
    		var currQuery = 'select ' + fieldName + ' as name, "' + dataSource.model + '" as model, id ';
            currQuery += ' from ' + model.getTableName();
    		currQuery += ' where ' + fieldName + ' = "' + searchValue + '"';
    		queryStrings.push(currQuery);
    		queryStrings.push('\n union \n');
    	}
    }
    
    queryStrings[queryStrings.length - 1] = '\n limit ' + numMaxResults;
    const queryStr = queryStrings.join('');
    const simpleQueryType = { type: db.sequelize.QueryTypes.SELECT};
    return db.sequelize.query(queryStr, simpleQueryType);
}