'use strict';

var await = require('../../lib/await');
import db = require('../models');
import BaseQuery = require('./BaseQuery');
import QueryGenerator = require('./QueryGenerator');

export interface IQueryParams {
    order: string[];
    filters: QueryGenerator.IFilter[];
    pagination: QueryGenerator.IPaginationOpts;
}

interface IQueryStrFn {
    (queryParams: IQueryParams): string; 
}

interface ITableQuery {
    queryStrFn: IQueryStrFn;
    fields: BaseQuery.IField[];
}

interface ITableQueries {
    [name: string]: ITableQuery;
}


export const queries:ITableQueries = {
    Basins: {
        queryStrFn: (queryParams: IQueryParams) => {
             const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'basins',
                    fields: [
                        'id',
                        'name'
                    ]
                },
                extraFields: [
                    ['"Basin"', 'model']
                ],
                joinTables: [],
                filters: queryParams.filters
            };
            
            return QueryGenerator.queryGenerator(options);
        },
        fields: [
            {
                label: 'Nome',
                ref: {
                    modelField: 'model',
                    idField: 'id',
                    valueField: 'name'
                }
            } 
        ]
    },
    
    Blocks: {
        queryStrFn: (queryParams: IQueryParams) => {
            const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'blocks',
                    fields: [
                        'id',
                        ['name', 'block_name'],
                        'status'
                    ]
                },
                joinTables: [
                    {
                        name: 'companies',
                        fields: [
                            ['id', 'operator_id'],
                            ['name', 'operator_name'],
                        ],
                        joinField: 'operator_id'
                    },
                    {
                        name: 'basins',
                        fields: [
                            ['id', 'basin_id'],
                            ['name', 'basin_name'],
                        ],
                        joinField: 'basin_id'
                    }
                ],
                extraFields: [
                    ['"Block"', 'model']
                ],
                filters: queryParams.filters
            };
            
            return QueryGenerator.queryGenerator(options);
        },
        fields: [
            {
                label: 'Nome',
                ref: {
                    modelField: 'model',
                    idField: 'id',
                    valueField: 'block_name'
                }
            },
            {
                label: 'Bacia',
                fieldName: 'basin_name',
                type: 'VARCHAR'
            },
            {
                label: 'Operador',
                fieldName: 'operator_name',
                type: 'VARCHAR'
            },
            {
                label: 'Status',
                fieldName: 'status',
                type: 'VARCHAR'
            }
        ]
    }
};

export function getQueryResult(queryName: string, queryParams: IQueryParams): Promise<any> {
    const simpleQueryType = { type: db.sequelize.QueryTypes.SELECT};
    const queryStr = queries[queryName].queryStrFn(queryParams);
    const orderBy = QueryGenerator.getOrderByStr(queryParams.order);
    const pagination = QueryGenerator.getPaginationStr(queryParams.pagination);
    const completeQueryStr = queryStr + orderBy + pagination;
    const recordsPromise = db.sequelize.query(completeQueryStr, simpleQueryType);
    
    const countQuery = 'select count(*) as count from (' + queryStr + ') t';
    const countPromise = db.sequelize.query(countQuery, simpleQueryType);
    
    return Promise.all([recordsPromise, countPromise]);
}