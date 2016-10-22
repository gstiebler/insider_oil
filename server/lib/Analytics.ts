"use strict"

import db = require('../db/models');
import dsParams = require('../lib/DataSourcesParams');
import { 
    Analytics, 
    IBaseQueryField, 
    IQueryParams 
} from '../../common/Interfaces';
import { fieldTypeStr } from './ModelUtils';
import * as TableQueries from '../db/queries/TableQueries';

const sources:Analytics.ISource[] = [
    {
        sourceName: 'DrillingRigs',
        groupFields: [
            'contractor_name',
            'operator_name',
            'land_sea',
            'status',
        ],
        valueFields: [
            'day_rate'
        ]
    },
    {
        sourceName: 'Wells',
        groupFields: [
            'operator_name',
            'block_name',
            'dr_name',
            'type',
            'category',
            'situation',
        ],
        valueFields: []
    },
    {
        sourceName: 'Blocks',
        groupFields: [
            'basin_name',
            'operator_name',
            'status',
        ],
        valueFields: []
    },
    {
        sourceName: 'FPSOs',
        groupFields: [
            'of_name',
            'b_name',
            'pu_status',
            'ow_name',
            'op_name',
            'situation',
        ],
        valueFields: []
    },    
    {
        sourceName: 'FixedProductionUnits',
        groupFields: [
            'of_name',
            'b_name',
            'pu_status',
            'ow_name',
            'op_name',
            'situation',
        ],
        valueFields: []
    },    
    {
        sourceName: 'SemiSubmersibleProductionUnits',
        groupFields: [
            'of_name',
            'b_name',
            'pu_status',
            'ow_name',
            'op_name',
            'situation',
        ],
        valueFields: []
    },
    {
        sourceName: 'oilFielsdProduction',
        groupFields: [
            'b_name',
            'state',
            'land_sea',
        ],
        valueFields: []
    },
    {
        sourceName: 'oilFieldsDevelopment',
        groupFields: [
            'b_name',
            'state',
            'land_sea',
        ],
        valueFields: []
    },
    {
        sourceName: 'Seismics',
        groupFields: [
            'authorized_company',
            'block_name',
            'basin_name',
        ],
        valueFields: []
    },
    {
        sourceName: 'Contracts',
        groupFields: [
            'supplier',
            'c_situation',
            'type',
        ],
        valueFields: [
            'day_rate',
            'value'
        ]
    },
    {
        sourceName: 'Boats',
        groupFields: [
            'type',
            'ow_name',
            'op_name',
        ],
        valueFields: []
    },
];

function getAFields(fieldsList: string[], fieldsMap: { [s: string]:  IBaseQueryField }):Analytics.IAField[] {
    return fieldsList.map((fieldName) => {
        return {
            name: fieldName,
            label: fieldsMap[fieldName].label
        };
    });
}

export function getSources():Analytics.IFrontendSource[] {
    const result:Analytics.IFrontendSource[] = sources.map((source) => {
        const tableParams = TableQueries.queries[source.sourceName];

        const fieldsMap: { [s: string]:  IBaseQueryField } = {};
        for(let bqf of tableParams.fields) {
            if(bqf.fieldName) {
                fieldsMap[bqf.fieldName] = bqf;
            } else {
                fieldsMap[bqf.ref.valueField] = bqf;
            }
        }

        const fs = {
            sourceName: source.sourceName,
            label: tableParams.title,
            groupFields: getAFields(source.groupFields, fieldsMap),
            valueFields: getAFields(source.valueFields, fieldsMap),
        }
        return fs;
    });

    return result;
}

export async function getCountResult(sourceName: string, 
                               groupField: string):Promise<Analytics.IResult> {
    const queryParams: IQueryParams = {
        order: [], 
        filters: [],
        pagination: {
            first: 0,
            itemsPerPage: 300
        } 
    };
    const simpleQueryType = { type: db.sequelize.QueryTypes.SELECT};
    const baseQueryStr = TableQueries.queries[sourceName].queryStrFn(queryParams);
    const select = 'select count(*) as value, tb.' + groupField + ' as label ';
    const fromStr = ' from (' + baseQueryStr + ') as tb ';
    const group = ' group by tb.' + groupField;
    const order = ' order by value desc ';
    const queryStr = select + fromStr + group + order;
    const recordsPromise = db.sequelize.query(queryStr, simpleQueryType);
    const records = await recordsPromise;
    return {
        items: records,
        othersValue: 0
    };   
}

/*
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

*/