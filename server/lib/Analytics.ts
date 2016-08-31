"use strict"

import db = require('../db/models');
import dsParams = require('../lib/DataSourcesParams');

function getAssociationByField(associations, fieldName: string):any {
    for(let key in associations) {
        let association = associations[key];
        if(association.identifierField = fieldName) {
            return association;
        }
    }
    return null;
}

export function getCount(sourceName: string, fieldName: string):Promise<any[]> {
    const model = db.models[sourceName];
    const params = dsParams[sourceName];
    const table = model.tableName;
    const field = model.attributes[fieldName];
    const association = getAssociationByField(model.associations, fieldName);
    const targetModel = association.target;
    const associationTable = targetModel.tableName;

    const select = 'SELECT COUNT('+ table +'.id) AS contador, '+ associationTable +'.name ';
    const fromStr = ' from ' + table;
    const join = ' left outer join ' + associationTable + ' on ' + 
            table + '.' + fieldName + ' = ' + associationTable + '.id ';
    const where = ' where ' + fieldName + ' IS NOT NULL ';
    const group = ' group by ' + fieldName;
    const order = ' order by contador desc ';
    const limit = ' limit 10 ';    
    const query = select + fromStr + join + where + group + order + limit;
    
    const simpleQueryType = { type: db.sequelize.QueryTypes.SELECT};
    return db.sequelize.query(query, simpleQueryType);
}
