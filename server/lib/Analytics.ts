"use strict"

import db = require('../db/models');
import dsParams = require('../lib/DataSourcesParams');
import { 
    NSAnalytics, 
    IBaseQueryField, 
    IQueryParams 
} from '../../common/Interfaces';
import { fieldTypeStr } from './ModelUtils';
import * as TableQueries from '../db/queries/TableQueries';

const sources:NSAnalytics.ISource[] = [
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

function getAFields(fieldsList: string[], fieldsMap: { [s: string]:  IBaseQueryField }):NSAnalytics.IAField[] {
    return fieldsList.map((fieldName) => {
        return {
            name: fieldName,
            label: fieldsMap[fieldName].label
        };
    });
}

export function getSources():NSAnalytics.IFrontendSource[] {
    const result:NSAnalytics.IFrontendSource[] = sources.map((source) => {
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

export async function getResult(sourceName: string, 
                                groupField: string,
                                valueField: string,
                                maxNumItems: number):Promise<NSAnalytics.IResult> {
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
    const selectValueStr = valueField == 'qtt*' ? 'count(*)' : 'sum(' + valueField+ ')';
    const select = 'select ' + selectValueStr + ' as value, tb.' + groupField + ' as label ';
    const fromStr = ' from (' + baseQueryStr + ') as tb ';
    const group = ' group by tb.' + groupField;
    const order = ' order by value desc ';
    const limit = ' limit 0, ' + maxNumItems;
    const queryStr = select + fromStr + group + order + limit;
    const recordsPromise = db.sequelize.query(queryStr, simpleQueryType);
    const records = await recordsPromise;
    return {
        items: records,
        othersValue: 0
    };   
}