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

const QTT_SPECIAL_NAME = 'qtt*';
const simpleQueryType = { type: db.sequelize.QueryTypes.SELECT};

const sources:NSAnalytics.ISource[] = [
    {
        sourceName: 'DrillingRigs',
        groupFields: [
            'contractor_name',
            'operator_name',
            'land_sea',
            'status',
            'start',
            'end',
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
            'start',
            'end',
            'conclusion'
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
            //'start',
            //'end',
            //'first_oil',
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
            //'start',
            //'end',
            //'first_oil',
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
            //'start',
            //'end',
            //'first_oil',
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
            'dou_publi_date',
            'end_date'
        ],
        valueFields: []
    },
    {
        sourceName: 'Contracts',
        groupFields: [
            'supplier',
            'c_situation',
            'type',
            'start',
            'end',
            'is_name'
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
        let valueFields:NSAnalytics.IAField[] = [
            {
                name: QTT_SPECIAL_NAME,
                label: 'Quantidade'
            }
        ] 
        
        valueFields = valueFields.concat(getAFields(source.valueFields, fieldsMap));

        const fs = {
            sourceName: source.sourceName,
            label: tableParams.title,
            groupFields: getAFields(source.groupFields, fieldsMap),
            valueFields: valueFields,
        }
        return fs;
    });

    return result;
}

function getValueSelectStr(valueField: string):string {
    return valueField == QTT_SPECIAL_NAME ? 'count(*)' : 'sum(' + valueField+ ')';
}

function getItemsQuery(baseQueryStr: string, 
                    groupField: string,
                    valueField: string,
                    maxNumItems: number):string {
    const selectValueStr = getValueSelectStr(valueField);
    const select = 'select ' + selectValueStr + ' as value, tb.' + groupField + ' as label ';
    const fromStr = ' from (' + baseQueryStr + ') as tb ';
    const group = ' group by tb.' + groupField;
    const order = ' order by value desc ';
    const limit = ' limit 0, ' + maxNumItems;
    const queryStr = select + fromStr + group + order + limit;
    return queryStr;
}

function getDateBasedQuery(baseQueryStr: string, 
                    groupField: string,
                    valueField: string,
                    maxNumItems: number):string {
    const selectValueStr = getValueSelectStr(valueField);
    const yearStr = ' year(tb.' + groupField + ') ';
    const select = 'select ' + selectValueStr + ' as value, ' + yearStr + ' as label ';
    const fromStr = ' from (' + baseQueryStr + ') as tb ';
    const where = ' where ' + groupField + ' is not null ';
    const group = ' group by ' + yearStr;
    const order = ' order by label ';
    const queryStr = select + fromStr + where + group + order;
    return queryStr;
}

async function getCurrencyRangeValues(baseQueryStr: string, 
                                      groupField: string):Promise<number> {
    const selectMinMax = 'select max(' + groupField + ') as maxv, min(' + groupField + ') as minv ';
    const fromStr = ' from (' + baseQueryStr + ') as tb ';
    const minMaxQry = selectMinMax + fromStr;
    const minMax = await db.sequelize.query(minMaxQry, simpleQueryType);
    const min = minMax[0].minv;
    const max = minMax[0].maxv;
    const exp10 = Math.log(max) / Math.log(10);
    const truncExp10 = Math.floor(exp10);
    const power10 = Math.pow(10, truncExp10 - 1); 

    /*const minFactor = Math.floor(min / power10);
    const maxFactor = Math.floor(max / power10);
    const inValues:number[] = [];
    for(let i = minFactor; i <= maxFactor; i++) {
        inValues.push(i * power10);
    }*/
    return power10;
}

async function getCurrencyBasedQuery(baseQueryStr: string, 
                    groupField: string,
                    valueField: string,
                    maxNumItems: number):Promise<string> {
    const max = await getCurrencyRangeValues(baseQueryStr, groupField);
    const groupFieldStr = ' floor(' + groupField + ' / ' + max + ') * ' + max;
    const selectValueStr = getValueSelectStr(valueField);
    const select = 'select ' + selectValueStr + ' as value, ' + groupFieldStr + ' as label ';
    const fromStr = ' from (' + baseQueryStr + ') as tb ';
    const group = ' group by label ';
    const order = ' order by label ';
    const queryStr = select + fromStr + group + order;
    return queryStr;
}

function getTotalQuery(baseQueryStr: string, valueField: string):string {
    const selectValueStr = getValueSelectStr(valueField);
    const select = 'select ' + selectValueStr + ' as value ';
    const fromStr = ' from (' + baseQueryStr + ') as tb ';
    const queryStr = select + fromStr;
    return queryStr;
}

function sumItems(items: NSAnalytics.IItemResult[]):number {
    let result = 0;
    for(let item of items) {
        result += item.value;
    }
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
    const tQuery = TableQueries.queries[sourceName];
    const baseQueryStr = tQuery.queryStrFn(queryParams);
    const groupFieldInfo = tQuery.fields.find((f) => { 
        if(f.fieldName) {
            return f.fieldName == groupField;
        } else {
            return f.ref.valueField == groupField;
        }
    });
    let items = null;
    let othersValue = 0;
    if(groupFieldInfo && groupFieldInfo.type == 'DATE') {
        const itemsQuery = getDateBasedQuery(baseQueryStr, groupField, valueField, maxNumItems);
        items = await db.sequelize.query(itemsQuery, simpleQueryType);
    } else if(groupFieldInfo && groupFieldInfo.type == 'CURRENCY') {
        const itemsQuery = await getCurrencyBasedQuery(baseQueryStr, groupField, valueField, maxNumItems);
        items = await db.sequelize.query(itemsQuery, simpleQueryType);
    } else {
        const itemsQuery = getItemsQuery(baseQueryStr, groupField, valueField, maxNumItems);
        items = await db.sequelize.query(itemsQuery, simpleQueryType);
        const totalQuery = getTotalQuery(baseQueryStr, valueField);
        const total = (await db.sequelize.query(totalQuery, simpleQueryType))[0].value;
        othersValue = total - sumItems(items);
    }
    return {
        items,
        othersValue
    };   
}