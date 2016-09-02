"use strict"

import db = require('../db/models');
import dsParams = require('../lib/DataSourcesParams');
import * as Interfaces from '../../common/Interfaces';
import { fieldTypeStr } from './ModelUtils';

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
    },
    {
        sourceName: 'DrillingRigOnshore',
        title: 'Sondas onshore',
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
    },
    {
        sourceName: 'Block',
        title: 'Blocos',
        possibleGroups: [
            {
                fieldName: 'status',
                label: 'Status'
            },
            {
                fieldName: 'operator_id',
                label: 'Operador'
            },
        ]
    },
    {
        sourceName: 'ProductionUnit',
        title: 'Unidades de produção',
        possibleGroups: [
            {
                fieldName: 'status',
                label: 'Status'
            },
            {
                fieldName: 'owner',
                label: 'Proprietário'
            },
            {
                fieldName: 'situation',
                label: 'Situação'
            },
            {
                fieldName: 'oil_field_id',
                label: 'Campo'
            },
            {
                fieldName: 'block_id',
                label: 'Bloco'
            },
            {
                fieldName: 'type',
                label: 'Tipo'
            },
        ]
    },
    {
        sourceName: 'OilField',
        title: 'Campos',
        possibleGroups: [
            {
                fieldName: 'state',
                label: 'Estado'
            },
            {
                fieldName: 'stage',
                label: 'Estágio'
            },
            {
                fieldName: 'basin_id',
                label: 'Bacia'
            },
            {
                fieldName: 'operator_id',
                label: 'Operador'
            },
        ]
    },
];

export function getSources():Interfaces.IAnalyticsSource[] {
    return sources;
}

function getAssociationByField(associations, fieldName: string):any {
    for(let key in associations) {
        let association = associations[key];
        if(association.identifierField == fieldName) {
            return association;
        }
    }
    return null;
}

function getCountAssociationField(sourceName: string, fieldName: string):Promise<Interfaces.IAnalyticsCount[]> {
    const model = db.models[sourceName];
    const params = dsParams[sourceName];
    const table = model.tableName;
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

function getCountTextField(sourceName: string, fieldName: string):Promise<Interfaces.IAnalyticsCount[]> {
    const model = db.models[sourceName];
    const params = dsParams[sourceName];
    const table = model.tableName;

    const select = 'SELECT COUNT(id) AS count_value, '+ fieldName +' as label ';
    const fromStr = ' from ' + table;
    const where = ' where ' + fieldName + ' IS NOT NULL ' +
                  ' and ' + fieldName + ' != "" ';
    const group = ' group by ' + fieldName;
    const order = ' order by count_value desc ';
    const limit = ' limit 10 ';    
    const query = select + fromStr + where + group + order + limit;
    
    const simpleQueryType = { type: db.sequelize.QueryTypes.SELECT};
    return db.sequelize.query(query, simpleQueryType);
}

export function getCount(sourceName: string, fieldName: string):Promise<Interfaces.IAnalyticsCount[]> {
    const model = db.models[sourceName];
    const field = model.attributes[fieldName];
    const typeStr = fieldTypeStr(field);
    if(typeStr.includes('VARCHAR')) {
        return getCountTextField(sourceName, fieldName);
    } else if (typeStr == 'ENUM') {
        return getCountTextField(sourceName, fieldName);
    }
    const association = getAssociationByField(model.associations, fieldName);
    if(association) {
        return getCountAssociationField(sourceName, fieldName);
    }
    throw 'Tipo da análise não definido: ' + typeStr;
}
