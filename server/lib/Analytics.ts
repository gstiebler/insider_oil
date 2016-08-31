"use strict"

import db = require('../db/models');
import dsParams = require('../lib/DataSourcesParams');
import * as Interfaces from '../../common/Interfaces';

const sources:Interfaces.IAnalyticsSource[] = [
    {
        sourceName: 'Well',
        title: 'Poços',
        possibleGroups: [
            {
                fieldName: 'operator_id',
                label: 'Operador'
            },
            {
                fieldName: 'block_id',
                label: 'Bloco'
            },
            {
                fieldName: 'oil_field_id',
                label: 'Campo'
            },
            {
                fieldName: 'production_unit_id',
                label: 'Unidade de produção'
            },
            {
                fieldName: 'drilling_rig_offshore_id',
                label: 'Sonda offshore'
            },
            {
                fieldName: 'drilling_rig_onshore_id',
                label: 'Sonda onshore'
            },
        ]
    },
    {
        sourceName: 'DrillingRigOffshore',
        title: 'Sondas offshore',
        possibleGroups: [
            {
                fieldName: 'operator_id',
                label: 'Operador'
            },
            {
                fieldName: 'contractor_id',
                label: 'Contratante'
            },
        ]
    }
];

export function getSources():Interfaces.IAnalyticsSource[] {
    return sources;
}

function getAssociationByField(associations, fieldName: string):any {
    for(let key in associations) {
        let association = associations[key];
        if(association.identifierField = fieldName) {
            return association;
        }
    }
    return null;
}

export function getCount(sourceName: string, fieldName: string):Promise<Interfaces.IAnalyticsCount[]> {
    const model = db.models[sourceName];
    const params = dsParams[sourceName];
    const table = model.tableName;
    const field = model.attributes[fieldName];
    const association = getAssociationByField(model.associations, fieldName);
    const targetModel = association.target;
    const associationTable = targetModel.tableName;

    const select = 'SELECT COUNT('+ table +'.id) AS count_value, '+ associationTable +'.name as label ';
    const fromStr = ' from ' + table;
    const join = ' left outer join ' + associationTable + ' on ' + 
            table + '.' + fieldName + ' = ' + associationTable + '.id ';
    const where = ' where ' + fieldName + ' IS NOT NULL ';
    const group = ' group by ' + fieldName;
    const order = ' order by count_value desc ';
    const limit = ' limit 10 ';    
    const query = select + fromStr + join + where + group + order + limit;
    
    const simpleQueryType = { type: db.sequelize.QueryTypes.SELECT};
    return db.sequelize.query(query, simpleQueryType);
}
