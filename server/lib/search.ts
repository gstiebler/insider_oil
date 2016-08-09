
'use strict';

var await = require('../lib/await');
var Sync = require('sync');
import db = require('../db/models');

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
    {
        model: 'OilPipeline',
        fields: ['name']
    },
];

// add ids to dataSources
export function initializeSearch():Promise<any> {
    return new Promise((resolve, reject) => {
        Sync(() => {
            for(var i = 0; i < dataSources.length; i++) {
                const searchOptions = { where: { name: dataSources[i].model } };
                const modelItem = await( db.models.ModelsList.findOne(searchOptions) );
                dataSources[i].model_id = modelItem.id;
            }
            resolve();
        }, (err) => {reject(err)});
    });
 }


export function searchLike(searchValue, numMaxResults) {
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

export function searchEqual(searchValue, numMaxResults) {
    var queryStrings = [];
    for( var i = 0; i < dataSources.length; i++) {
    	const dataSource = dataSources[i];
    	for( var j = 0; j < dataSource.fields.length; j++ ) {
    		const model = db.models[dataSource.model];
    		const fieldName = dataSource.fields[j];
    		var currQuery = 'select ' + fieldName + ' as name, "' + dataSource.model + '" as model, ' + dataSource.model_id + ' as model_id, id ';
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