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
                filters: queryParams.filters,
                order: queryParams.order
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
                        joinField: 'blocks.operator_id'
                    },
                    {
                        name: 'basins',
                        fields: [
                            ['id', 'basin_id'],
                            ['name', 'basin_name'],
                        ],
                        joinField: 'blocks.basin_id'
                    }
                ],
                extraFields: [
                    ['"Block"', 'model'],
                    ['"Basin"', 'basin_model'],
                    ['"Company"', 'operator_model']
                ],
                filters: queryParams.filters,
                order: queryParams.order
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
      
    /** Persons */
    Persons: {
        queryStrFn: (queryParams: QueryGenerator.IQueryParams) => {
            const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'persons',
                    fields: [
                        ['id', 'person_id'],
                        ['name', 'person_name'],
                        'position'
                    ]
                },
                joinTables: [
                    {
                        name: 'companies',
                        fields: [
                            ['id', 'company_id'],
                            ['name', 'company_name'],
                        ],
                        joinField: 'persons.company_id'
                    }
                ],
                extraFields: [
                    ['"Person"', 'model'],
                    ['"Company"', 'company_model']
                ],
                filters: queryParams.filters,
                order: queryParams.order
            };
            
            return QueryGenerator.queryGenerator(options);
        },
        fields: [
            {
                label: 'Nome',
                ref: {
                    modelField: 'model',
                    idField: 'person_id',
                    valueField: 'person_name'
                }
            },
            {
                label: 'Empresa',
                ref: {
                    modelField: 'company_model',
                    idField: 'company_id',
                    valueField: 'company_name'
                }
            },
            {
                label: 'Cargo',
                fieldName: 'position',
                type: 'VARCHAR'
            }
        ]
    },
    
    /** DrillingRigs */
    DrillingRigs: {
        queryStrFn: (queryParams: QueryGenerator.IQueryParams) => {
            const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'drilling_rigs_onshore',
                    fields: [
                        ['id', 'dr_id'],
                        ['name', 'dr_name'],
                        'start',
                        'end',
                        'status',
                        'day_rate'
                    ]
                },
                joinTables: [
                    {
                        name: 'companies',
                        fields: [
                            ['id', 'contractor_id'],
                            ['name', 'contractor_name'],
                        ],
                        joinField: 'drilling_rigs_onshore.contractor_id'
                    }
                ],
                extraFields: [
                    ['"DrillingRigOnshore"', 'model'],
                    ['"Terra"', 'land_sea'],
                    ['"Company"', 'contractor_model']
                ],
                filters: queryParams.filters,
                order: []
            };
            const onshoreQryStr = QueryGenerator.queryGenerator(options);
            
            options.table.name = 'drilling_rigs_offshore';
            options.joinTables[0].joinField = 'drilling_rigs_offshore.contractor_id';
            options.extraFields[0] = ['"DrillingRigOffshore"', 'model'];
            options.extraFields[1] = ['"Mar"', 'land_sea'];
            const offshoreQryStr = QueryGenerator.queryGenerator(options);
            
            const orderQry = QueryGenerator.getOrderByStr(queryParams.order);
            return onshoreQryStr + ' union ' + offshoreQryStr + orderQry;
        },
        fields: [
            {
                label: 'Sonda',
                ref: {
                    modelField: 'model',
                    idField: 'dr_id',
                    valueField: 'dr_name'
                }
            },
            {
                label: 'Operador',
                ref: {
                    modelField: 'contractor_model',
                    idField: 'contractor_id',
                    valueField: 'contractor_name'
                }
            },
            {
                label: 'Terra/Mar',
                fieldName: 'land_sea',
                type: 'VARCHAR'
            },
            {
                label: 'Início contrato',
                fieldName: 'start',
                type: 'DATE'
            },
            {
                label: 'Fim contrato',
                fieldName: 'end',
                type: 'DATE'
            },
            {
                label: 'Status',
                fieldName: 'status',
                type: 'VARCHAR'
            },
            {
                label: 'Day rate',
                fieldName: 'day_rate',
                type: 'VARCHAR'
            }
        ]
    },
    
    /** Comercial declarations 
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
    },*/
    
    /** Ambiental Licenses 
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
    },*/
    
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
                    ['"Block"', 'block_model'],
                    ['"Basin"', 'basin_model']
                ],
                joinTables: [
                    {
                        name: 'blocks',
                        fields: [
                            ['id', 'block_id'],
                            ['name', 'block_name'],
                        ],
                        joinField: 'seismics.block_id'
                    },
                    {
                        name: 'basins',
                        fields: [
                            ['id', 'basin_id'],
                            ['name', 'basin_name'],
                        ],
                        joinField: 'blocks.basin_id'
                    }
                ],
                filters: queryParams.filters,
                order: queryParams.order
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
                label: 'Bloco',
                ref: {
                    modelField: 'block_model',
                    idField: 'block_id',
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
    const pagination = QueryGenerator.getPaginationStr(queryParams.pagination);
    const completeQueryStr = queryStr + pagination;
    const recordsPromise = db.sequelize.query(completeQueryStr, simpleQueryType);
    
    const countQuery = 'select count(*) as count from (' + queryStr + ') t';
    const countPromise = db.sequelize.query(countQuery, simpleQueryType);
    
    return Promise.all([recordsPromise, countPromise]);
}