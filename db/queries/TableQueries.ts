'use strict';

var await = require('../../lib/await');
import db = require('../models');
import BaseQuery = require('./BaseQuery');
import QueryGenerator = require('./QueryGenerator');

interface IQueryStrFn {
    (queryParams: QueryGenerator.IQueryParams): string; 
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
        queryStrFn: (queryParams: QueryGenerator.IQueryParams) => {
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
        queryStrFn: (queryParams: QueryGenerator.IQueryParams) => {
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
                    ['"Block"', 'model'],
                    ['"Basin"', 'basin_model'],
                    ['"Company"', 'operator_model']
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
                ref: {
                    modelField: 'basin_model',
                    idField: 'basin_id',
                    valueField: 'basin_name'
                }
            },
            {
                label: 'Operador',
                ref: {
                    modelField: 'operator_model',
                    idField: 'operator_id',
                    valueField: 'operator_name'
                }
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
        queryStrFn: (queryParams: QueryGenerator.IQueryParams) => {
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
        queryStrFn: (queryParams: QueryGenerator.IQueryParams) => {
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
                type: 'DATE'
            },
            {
                label: 'Vencimento',
                fieldName: 'end',
                type: 'DATE'
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
    },
    
    /** Seismics */
    Seismics: {
        queryStrFn: (queryParams: QueryGenerator.IQueryParams) => {
             const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'seismics',
                    fields: [
                        ['id', 's_id'],
                        'process',
                        'authorized_company',
                        'dou_publi_date',
                        'end_date',
                        'authorized_technologies'
                    ]
                },
                extraFields: [
                    ['"Seismic"', 'model'],
                    ['"Basin"', 'basin_model']
                ],
                joinTables: [
                    {
                        name: 'basins',
                        fields: [
                            ['id', 'basin_id'],
                            ['name', 'basin_name'],
                        ],
                        joinField: 'basin_id'
                    }
                ],
                filters: queryParams.filters
            };
            
            return QueryGenerator.queryGenerator(options);
        },
        fields: [
            {
                label: 'Processo',
                ref: {
                    modelField: 'model',
                    idField: 's_id',
                    valueField: 'process'
                }
            },
            {
                label: 'Empresa autorizada',
                fieldName: 'authorized_company',
                type: 'VARCHAR'
            },
            {
                label: 'Publicação no DOU',
                fieldName: 'dou_publi_date',
                type: 'DATE'
            },
            {
                label: 'Validade',
                fieldName: 'end_date',
                type: 'DATE'
            },
            {
                label: 'Bacia',
                ref: {
                    modelField: 'basin_model',
                    idField: 'basin_id',
                    valueField: 'basin_name'
                }
            }
        ]
    },
    
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

export function getQueryResult(queryName: string, queryParams: QueryGenerator.IQueryParams): Promise<any> {
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