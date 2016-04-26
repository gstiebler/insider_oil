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
    /** Basins */
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
    
    /** Blocks */
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
    },
    
    /** Comercial declarations */
    ComercialDeclarations: {
        queryStrFn: (queryParams: IQueryParams) => {
            const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'comercial_declarations',
                    fields: [
                        ['id', 'cd_id']
                        ['name', 'cd_name'],
                        'date'
                    ]
                },
                joinTables: [
                    {
                        name: 'basins',
                        fields: [
                            ['id', 'basin_id'],
                            ['name', 'basin_name'],
                        ],
                        joinField: 'basin_id'
                    },
                    {
                        name: 'oil_fields',
                        fields: [
                            ['id', 'oil_field_id'],
                            ['name', 'oil_field_name'],
                        ],
                        joinField: 'oil_field_id'
                    }
                ],
                extraFields: [
                    ['"ComercialDeclaration"', 'model']
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
                    idField: 'cd_id',
                    valueField: 'cd_name'
                }
            },
            {
                label: 'Bacia',
                fieldName: 'basin_name',
                type: 'VARCHAR'
            },
            {
                label: 'Campo',
                fieldName: 'oil_field_name',
                type: 'VARCHAR'
            },
            {
                label: 'Data',
                fieldName: 'date',
                type: 'DATE'
            }
        ]
    },
    
    /** Ambiental Licenses */
    AmbientalLicenses: {
        queryStrFn: (queryParams: IQueryParams) => {
            const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'ambiental_licenses',
                    fields: [
                        'id',
                        'license',
                        'start',
                        'end',
                        'enterprise',
                        'entrepreneur',
                        'process',
                        'tipology',
                        'pac'
                    ]
                },
                joinTables: [],
                extraFields: [
                    ['"AmbientalLicense"', 'model']
                ],
                filters: queryParams.filters
            };
            
            return QueryGenerator.queryGenerator(options);
        },
        fields: [
            {
                label: 'Nro da licença',
                ref: {
                    modelField: 'model',
                    idField: 'id',
                    valueField: 'license'
                }
            },
            {
                label: 'Emissão',
                fieldName: 'start',
                type: 'VARCHAR'
            },
            {
                label: 'Vencimento',
                fieldName: 'end',
                type: 'VARCHAR'
            },
            {
                label: 'Empreendimento',
                fieldName: 'enterprise',
                type: 'VARCHAR'
            },
            {
                label: 'Empreendedor',
                fieldName: 'entrepreneur',
                type: 'VARCHAR'
            },
            {
                label: 'Nº do processo',
                fieldName: 'process',
                type: 'VARCHAR'
            },
            {
                label: 'Tipologia',
                fieldName: 'tipology',
                type: 'VARCHAR'
            },
            {
                label: 'PAC',
                fieldName: 'pac',
                type: 'VARCHAR'
            }
        ]
    }
    
    /** sample
    ComercialDeclarations: {
        queryStrFn: (queryParams: IQueryParams) => {
            const options:QueryGenerator.IQueryOpts = {
            {
                table: {
                    name: 'blocks',
                    fields: [
                        'id',
                        ['name', 'block_name'],
                        'status'
                    ]
                },
                joinTables: [],
                extraFields: [
                    ['"Basin"', 'model']
                ],
                filters: queryParams.filters
            },
            };
            
            return QueryGenerator.queryGenerator(options);
        },
        fields: [
            {}
        ]
    } */
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