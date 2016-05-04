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

const productionUnit:ITableQuery = {
    queryStrFn: (queryParams: QueryGenerator.IQueryParams) => {
        const options:QueryGenerator.IQueryOpts = {
            table: {
                name: 'production_units',
                fields: [
                    ['id', 'pu_id'],
                    ['name', 'pu_name'],
                    'owner',
                    'situation'
                ]
            },
            joinTables: [
                {
                    name: 'oil_fields',
                    fields: [
                        ['id', 'of_id'],
                        ['name', 'of_name'],
                    ],
                    joinField: 'production_units.oil_field_id'
                },
            ],
            extraFields: [
                ['"ProductionUnit"', 'model'],
                ['"OilField"', 'of_model'],
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
                idField: 'pu_id',
                valueField: 'pu_name'
            }
        },
        {
            label: 'Campo',
            ref: {
                modelField: 'of_model',
                idField: 'of_id',
                valueField: 'of_name'
            }
        },
        {
            label: 'Empresa proprietária',
            fieldName: 'owner',
            type: 'VARCHAR'
        },
        {
            label: 'Situação',
            fieldName: 'situation',
            type: 'VARCHAR'
        },
    ]
};


const oilField:ITableQuery = {
    queryStrFn: (queryParams: QueryGenerator.IQueryParams) => {
        const options:QueryGenerator.IQueryOpts = {
            table: {
                name: 'oil_fields',
                fields: [
                    ['id', 'of_id'],
                    ['name', 'of_name'],
                    'state',
                    'concessionaries'
                ]
            },
            joinTables: [
                {
                    name: 'basins',
                    fields: [
                        ['id', 'b_id'],
                        ['name', 'b_name'],
                    ],
                    joinField: 'oil_fields.basin_id'
                },
            ],
            extraFields: [
                ['"OilField"', 'model'],
                ['"Basin"', 'b_model'],
                ['if(shore = "on", "Terra", "Mar")', 'land_sea'],
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
                idField: 'of_id',
                valueField: 'of_name'
            }
        },
        {
            label: 'Basin',
            ref: {
                modelField: 'b_model',
                idField: 'b_id',
                valueField: 'b_name'
            }
        },
        {
            label: 'Concessionárias',
            fieldName: 'concessionaries',
            type: 'VARCHAR'
        },
        {
            label: 'Estado',
            fieldName: 'state',
            type: 'VARCHAR'
        },
        {
            label: 'Terra/Mar',
            fieldName: 'land_sea',
            type: 'VARCHAR'
        },
    ]
};


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
    
     Companies: {
        queryStrFn: (queryParams: QueryGenerator.IQueryParams) => {
             const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'companies',
                    fields: [
                        'id',
                        'name',
                        'address'
                    ]
                },
                extraFields: [
                    ['"Company"', 'model']
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
            },
            {
                label: 'Endereço',
                fieldName: 'address',
                type: 'VARCHAR'
            },
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
    
    Wells: {
        queryStrFn: (queryParams: QueryGenerator.IQueryParams) => {    
            const wellOpts:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'wells',
                    fields: [
                        ['name', 'well_name'],
                        'name_operator',
                        'type',
                        'category',
                        'reclassification',
                        'situation',
                        'start',
                        'end',
                        'conclusion'
                    ]
                },
                extraFields: [
                    ['"Block"', 'model_block'],
                    ['"Company"', 'model_operator'],
                    ['if(isnull(drilling_rigs_onshore.name), "DrillingRigOffshore", "DrillingRigOnshore")', 'dr_model'],
                    ['if(isnull(drilling_rigs_onshore.name), drilling_rigs_offshore.name, drilling_rigs_onshore.name)', 'dr_name'],
                    ['if(isnull(drilling_rigs_onshore.name), wells.drilling_rig_offshore_id, wells.drilling_rig_onshore_id)', 'dr_id'],
                ],
                joinTables: [
                    {
                        name: 'drilling_rigs_onshore',
                        fields: [],
                        joinField: 'wells.drilling_rig_onshore_id'
                    },
                    {
                        name: 'drilling_rigs_offshore',
                        fields: [],
                        joinField: 'wells.drilling_rig_offshore_id'
                    },
                    {
                        name: 'companies',
                        fields: [
                            ['id', 'operator_id'],
                            ['name', 'operator_name'],
                        ],
                        joinField: 'wells.operator_id'
                    },
                    {
                        name: 'blocks',
                        fields: [
                            ['id', 'block_id'],
                            ['name', 'block_name'],
                        ],
                        joinField: 'wells.block_id'
                    }
                ],
                filters: queryParams.filters,
                order: queryParams.order
            }
            
            return QueryGenerator.queryGenerator(wellOpts);
        },
        fields: [
            {
                label: 'Operador',
                ref: {
                    modelField: 'model_operator',
                    idField: 'operator_id',
                    valueField: 'operator_name'
                }
            },
            {
                label: 'Nome',
                fieldName: 'well_name',
                type: 'VARCHAR'
            },
            {
                label: 'Nome operador', 
                fieldName: 'name_operator',
                type: 'VARCHAR'
            },
            {
                label: 'Bloco',
                ref: {
                    modelField: 'model_block',
                    idField: 'block_id',
                    valueField: 'block_name'
                }
            },
            {
                label: 'Sonda',
                ref: {
                    modelField: 'dr_model',
                    idField: 'dr_id',
                    valueField: 'dr_name'
                }
            },
            {
                label: 'Tipo',
                fieldName: 'type',
                type: 'VARCHAR'
            },
            {
                label: 'Categoria',
                fieldName: 'category',
                type: 'VARCHAR'
            },
            {
                label: 'Reclassificação',
                fieldName: 'reclassification',
                type: 'VARCHAR'
            },
            {
                label: 'Situação',
                fieldName: 'situation',
                type: 'VARCHAR'
            },
            {
                label: 'Início',
                fieldName: 'start',
                type: 'DATE'
            },
            {
                label: 'Término',
                fieldName: 'end',
                type: 'DATE'
            },
            {
                label: 'Conclusão',
                fieldName: 'conclusion',
                type: 'DATE'
            },
        ]
    },
    
    FPSOs: {
        queryStrFn: (queryParams: QueryGenerator.IQueryParams) => {
            queryParams.filters.push(
                {
                    field: 'type',
                    equal: '"FPSO"'
                }
            );
            return productionUnit.queryStrFn(queryParams);
        },
        fields: productionUnit.fields
    },
    
    FixedProductionUnits: {
        queryStrFn: (queryParams: QueryGenerator.IQueryParams) => {
            queryParams.filters.push(
                {
                    field: 'type',
                    equal: '"FIXED"'
                }
            );
            return productionUnit.queryStrFn(queryParams);
        },
        fields: productionUnit.fields
    },
    
    SemiSubmersibleProductionUnits: {
        queryStrFn: (queryParams: QueryGenerator.IQueryParams) => {
            queryParams.filters.push(
                {
                    field: 'type',
                    equal: '"SEMI"'
                }
            );
            return productionUnit.queryStrFn(queryParams);
        },
        fields: productionUnit.fields
    },
    
    oilFielsdProduction: {
        queryStrFn: (queryParams: QueryGenerator.IQueryParams) => {
            queryParams.filters.push(
                {
                    field: 'stage',
                    equal: '"production"'
                }
            );
            return oilField.queryStrFn(queryParams);
        },
        fields: oilField.fields
    },
    
    oilFieldsDevelopment: {
        queryStrFn: (queryParams: QueryGenerator.IQueryParams) => {
            queryParams.filters.push(
                {
                    field: 'stage',
                    equal: '"development"'
                }
            );
            return oilField.queryStrFn(queryParams);
        },
        fields: oilField.fields
    },
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