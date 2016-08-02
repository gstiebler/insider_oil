'use strict';

var await = require('../../lib/await');
import db = require('../models');
import BaseQuery = require('./BaseQuery');
import QueryGenerator = require('./QueryGenerator');
import * as TableQueries from './TableQueries';

/** function that returns the SQL query string */
interface IQueryStrFn {
    (filters:any): string; 
}

interface IQueryById {
    queryStrFn: IQueryStrFn;
    fields: BaseQuery.IField[];
}

interface IQueriesById {
    [name: string]: IQueryById;
}

function wellsByDrillingRigOffshoreQueryOpts(filter):QueryGenerator.IQueryOpts {
    return {
        table: {
            name: 'wells',
            fields: [
                ['id', 'w_id'],
                ['name', 'well_name'],
                'start'
            ]
        },
        joinTables: [],
        extraFields: [
            ['"Well"', 'model'],
        ],
        filters: [
            {
                field: 'wells.drilling_rig_offshore_id',
                equal: filter.id
            }
        ],
        order: [ 
            {
                fieldName: 'well_name',
                dir: 'asc'
            }
        ],
    };
}
const wellsByDrillingRigOffshore = {
    queryStrFn: (filter) => {
        const options:QueryGenerator.IQueryOpts = wellsByDrillingRigOffshoreQueryOpts(filter);
        return QueryGenerator.queryGenerator(options);
    },
    fields: [
    {
            label: 'Poço',
            ref: {
                modelField: 'model',
                idField: 'w_id',
                valueField: 'well_name'
            }
        },
        {
            label: 'Início',
            fieldName: 'start',
            type: 'DATE'
        },
    ]
}

const queries:IQueriesById = {
    PersonsByProject: {
        queryStrFn: (filters) => {
            const modelsListFilter = {
                name: filters.dataSource
            }
            let modelListId = -1;
            const modelInList = await( db.models.ModelsList.find({ where: modelsListFilter }) );
            if(modelInList) {
                modelListId = modelInList.id;
            }
            
            const personOpts:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'person_projects',
                    fields: [
                        'description'
                    ]
                },
                extraFields: [
                    ['"Person"', 'p_model'],
                    ['"Company"', 'c_model'],
                ],
                joinTables: [
                    {
                        name: 'persons',
                        fields: [
                            ['id', 'p_id'],
                            ['name', 'p_name'],
                            'position',
                        ],
                        joinField: 'person_projects.person_id'
                    },
                    {
                        name: 'companies',
                        fields: [
                            ['id', 'c_id'],
                            ['name', 'c_name']
                        ],
                        joinField: 'persons.company_id'
                    },
                ],
                filters: [
                    {
                        field: 'person_projects.model_id',
                        equal: modelListId
                    },
                    {
                        field: 'person_projects.model_ref_id',
                        equal: filters.project_id
                    }
                ],
                order: [
                    {
                        fieldName: 'p_name',
                        dir: 'asc'
                    }
                ]
            }
            
            var query = QueryGenerator.queryGenerator(personOpts);
            return query;
        },
        fields: [
            {
                label: 'Nome',
                ref: {
                    modelField: 'p_model',
                    idField: 'p_id',
                    valueField: 'p_name'
                }
            },
            {
                label: 'Empresa',
                ref: {
                    modelField: 'c_model',
                    idField: 'c_id',
                    valueField: 'c_name'
                }
            },
            {
                label: 'Cargo',
                fieldName: 'position',
                type: 'VARCHAR'
            },
            {
                label: 'Descrição',
                fieldName: 'description',
                type: 'VARCHAR'
            }
        ]
    },
    
    NewsByObject: {
        queryStrFn: (filters) => {
            const modelName = filters.modelName;
            const id = filters.id;
            const modelIdQuery = 'select m.id from models_list m where m.name = "' + modelName + '" group by m.id';
            const newsIdQuery = 'SELECT nm.news_id FROM news_models nm ' +
                ' where nm.model_id = (' + modelIdQuery + ')' +
                ' and nm.model_ref_id = ' + id;
            const newsQuery = 'select n.id, n.title, n.created_at, "News" as model, u.name as author_name' +
                ' from news n' +
                ' left outer join users u on n.author_id = u.id ' +
                ' where n.id in (' + newsIdQuery + ')';
            return newsQuery;
        },
        fields: [
            {
                label: 'Tí­tulo',
                ref: {
                    modelField: 'model',
                    idField: 'id',
                    valueField: 'title'
                }
            },
            {
                label: 'Criada em',
                fieldName: 'created_at',
                type: 'DATE'
            },
        ]
    }, 
    
    BidsByObject: {
        queryStrFn: (filters) => {
            const modelsListFilter = {
                name: filters.dataSource
            }
            let modelListId = -1;
            const modelInList = await( db.models.ModelsList.find({ where: modelsListFilter }) );
            if(modelInList) {
                modelListId = modelInList.id;
            }
            
            const customFilters = [
                { field: 'model_id', equal: modelListId },
                { field: 'obj_id', equal:filters.obj_id  },
            ];
            const queryParams: QueryGenerator.IQueryParams = {
                filters: customFilters,
                order: [ { fieldName: 'opening_moment', dir: 'desc' } ],
                pagination: { first: 0, itemsPerPage: 100 }
            };
            return TableQueries.queries['Bids'].queryStrFn(queryParams);
        },
        fields: TableQueries.queries['Bids'].fields
    },
    
    contractsByObject: {
        queryStrFn: (filters) => {
            const modelsListFilter = {
                name: filters.dataSource
            }
            let modelListId = -1;
            const modelInList = await( db.models.ModelsList.find({ where: modelsListFilter }) );
            if(modelInList) {
                modelListId = modelInList.id;
            }
            
            const contractProjectsFilters = {
                model_id: modelListId,
                obj_id: filters.obj_id
            };
            const contractProjects = 
                await( db.models.ContractProjects.findAll({ where: contractProjectsFilters }) );
            const contractIds = contractProjects.map((cp) => { 
                return cp.contract_id; 
            });
            const contractFilters = [
                {
                    field: 'c_id',
                    in: contractIds
                }
            ]

            const queryParams: QueryGenerator.IQueryParams = {
                filters: contractFilters,
                order: [ { fieldName: 'start', dir: 'desc' } ],
                pagination: { first: 0, itemsPerPage: 100 }
            };
            return TableQueries.queries['Contracts'].queryStrFn(queryParams);
        },
        fields: TableQueries.queries['Contracts'].fields
    },
    
    ambientalLicenseByBlock: {
        queryStrFn: (filter) => {
            var query = 'select al.id, license, start, end, enterprise, entrepreneur, "AmbientalLicense" as model ';
            query += 'from ambiental_licenses al, ambiental_license_blocks alb ';
            query += 'where alb.ambiental_license_id = al.id ';
            query += '  and alb.block_id = ' + filter.id;
            query += ' order by al.license ';
            return query;
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
            }
        ]
    },
    
    comercialDeclarationsByBlock: {
        queryStrFn: (filter) => {
            const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'comercial_declarations',
                    fields: [ 'id', 'attached', 'date', ]
                },
                extraFields: [ ['"ComercialDeclaration"', 'model'] ],
                joinTables: [],
                filters: [ { field: 'block_id', equal: filter.id } ],
                order: [ { fieldName: 'date', dir: 'asc' } ]
            };
            
            return QueryGenerator.queryGenerator(options);
        },
        fields: [
            {
                label: 'Anexado',
                ref: {
                    modelField: 'model',
                    idField: 'id',
                    valueField: 'attached'
                }
            },
            {
                label: 'Data',
                fieldName: 'date',
                type: 'DATE'
            }
        ]
    },
    
    seismicsByBlock: {
        queryStrFn: (filter) => {
            const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'seismics',
                    fields: [ 'id', 'process', 'authorized_company',
                        'dou_publi_date', 'end_date', 'authorized_technologies' ]
                },
                extraFields: [ ['"Seismic"', 'model'] ],
                joinTables: [],
                filters: [ { field: 'block_id', equal: filter.id } ],
                order: [ { fieldName: 'process', dir: 'asc' } ]
            };
            
            return QueryGenerator.queryGenerator(options);
        },
        fields: [
            {
                label: 'Processo',
                ref: {
                    modelField: 'model',
                    idField: 'id',
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
                label: 'Tecnologias autorizadas',
                fieldName: 'authorized_technologies',
                type: 'VARCHAR'
            },
        ]
    },
    
    hydrocarbonEvidencesByBlock: {
        queryStrFn: (filter) => {
            const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'hydrocarbon_evidences',
                    fields: [ 'notification_date', 'fluids', 'depth' ]
                },
                extraFields: [],
                joinTables: [
                    {
                        name: 'wells',
                        fields: [
                            ['name', 'well_name'],
                        ],
                        joinField: 'hydrocarbon_evidences.well_id'
                    },
                ],
                filters: [ { field: 'block_id', equal: filter.id } ],
                order: [ { fieldName: 'notification_date', dir: 'asc' } ]
            };
            
            return QueryGenerator.queryGenerator(options);
        },
        fields: [
            {
                label: 'Poço',
                fieldName: 'well_name',
                type: 'VARCHAR'
            },
            {
                label: 'Data de notificação',
                fieldName: 'notification_date',
                type: 'DATE'
            },
            {
                label: 'Fluidos',
                fieldName: 'fluids',
                type: 'VARCHAR'
            },
            {
                label: "Lâmina d'água",
                fieldName: 'depth',
                type: 'FLOAT'
            },
        ]
    },
    
    hydrocarbonEvidencesByOilField: {
        queryStrFn: (filter) => {
            const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'hydrocarbon_evidences',
                    fields: [ 'notification_date', 'fluids', 'depth' ]
                },
                extraFields: [],
                joinTables: [
                    {
                        name: 'wells',
                        fields: [
                            ['name', 'well_name'],
                        ],
                        joinField: 'hydrocarbon_evidences.well_id'
                    },
                    {
                        name: 'oil_fields',
                        fields: [
                            ['id', 'oil_field_id'],
                        ],
                        joinCond: 'oil_fields.block_id = wells.block_id'
                    },
                ],
                filters: [ { field: 'oil_field_id', equal: filter.id } ],
                order: [ { fieldName: 'notification_date', dir: 'asc' } ]
            };
            
            return QueryGenerator.queryGenerator(options);
        },
        fields: [
            {
                label: 'Poço',
                fieldName: 'well_name',
                type: 'VARCHAR'
            },
            {
                label: 'Data de notificação',
                fieldName: 'notification_date',
                type: 'DATE'
            },
            {
                label: 'Fluidos',
                fieldName: 'fluids',
                type: 'VARCHAR'
            },
            {
                label: "Lâmina d'água",
                fieldName: 'depth',
                type: 'FLOAT'
            },
        ]
    },
    
    wellsByBlock: {
        queryStrFn: (filter) => {        
            const wellOpts:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'wells',
                    fields: [
                        ['id', 'w_id'],
                        ['name', 'well_name'],
                        'start'
                    ]
                },
                extraFields: [
                    ['"Well"', 'model'],
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
                ],
                filters: [
                    {
                        field: 'wells.block_id',
                        equal: filter.id
                    }
                ],
                order: [
                    {
                        fieldName: 'well_name',
                        dir: 'asc'
                    }
                ]
            }
            
            var query = QueryGenerator.queryGenerator(wellOpts);
            return query;
        },
        fields: [
            {
                label: 'Nome',
                ref: {
                    modelField: 'model',
                    idField: 'w_id',
                    valueField: 'well_name'
                }
            },
            {
                label: 'Início',
                fieldName: 'start',
                type: 'DATE'
            },
            {
                label: 'Sonda',
                ref: {
                    modelField: 'dr_model',
                    idField: 'dr_id',
                    valueField: 'dr_name'
                }
            }
        ]
    },
    
    personsByCompany: {
        queryStrFn: (filter) => {
            const queryParams: QueryGenerator.IQueryParams = {
                filters: [ { field: 'company_id', equal: filter.id } ],
                order: [ { fieldName: 'person_name', dir: 'asc' } ],
                pagination: { first: 0, itemsPerPage: 100 }
            };
            return TableQueries.queries['Persons'].queryStrFn(queryParams);
        },fields: [
            {
                label: 'Nome',
                ref: {
                    modelField: 'model',
                    idField: 'person_id',
                    valueField: 'person_name'
                }
            },
            {
                label: 'Cargo',
                fieldName: 'position',
                type: 'VARCHAR'
            }
        ]
    },
    
    maintenanceDatesByProductionUnit: {
        queryStrFn: (filter) => {        
            const maintenanceOpts:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'maintenance_dates',
                    fields: [
                        'period'
                    ]
                },
                extraFields: [
                    ['concat(lpad(month(period), 2, "0"), "/",year(period))', 'formatted_period'],
                ],
                joinTables: [],
                filters: [
                    {
                        field: 'maintenance_dates.production_unit_id',
                        equal: filter.id
                    }
                ],
                order: [
                    {
                        fieldName: 'period',
                        dir: 'desc'
                    }
                ]
            }
            
            var query = QueryGenerator.queryGenerator(maintenanceOpts);
            return query;
        },
        fields: [
            {
                label: 'Data',
                fieldName: 'formatted_period',
                type: 'VARCHAR'
            },
        ]
    },

    productionUnitByOilField: {
        queryStrFn: (filter) => {
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
                joinTables: [],
                extraFields: [
                    ['"ProductionUnit"', 'model'],
                ],
                filters: [
                    {
                        field: 'production_units.oil_field_id',
                        equal: filter.id
                    }
                ],
                order: [ 
                    {
                        fieldName: 'pu_name',
                        dir: 'asc'
                    }
                ],
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
    },
    
    productionUnitByBlock: {
        queryStrFn: (filter) => {
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
                joinTables: [],
                extraFields: [
                    ['"ProductionUnit"', 'model'],
                ],
                filters: [
                    {
                        field: 'production_units.block_id',
                        equal: filter.id
                    }
                ],
                order: [ 
                    {
                        fieldName: 'pu_name',
                        dir: 'asc'
                    }
                ],
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
    },

    wellsByDrillingRigOffshore: wellsByDrillingRigOffshore,

    wellsByDrillingRigOnshore: {
        queryStrFn: (filter) => {
            const options:QueryGenerator.IQueryOpts = wellsByDrillingRigOffshoreQueryOpts(filter);
            options.filters = [
                {
                    field: 'wells.drilling_rig_onshore_id',
                    equal: filter.id 
                }
            ]
            return QueryGenerator.queryGenerator(options);
        },
        fields: wellsByDrillingRigOffshore.fields
    },

    blocksOperatedByCompany: {
        queryStrFn: (filter) => {
            const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'blocks',
                    fields: [
                        ['id', 'bl_id'],
                        ['name', 'bl_name'],
                        'status',
                    ]
                },
                joinTables: [],
                extraFields: [
                    ['"Block"', 'model'],
                ],
                filters: [
                    {
                        field: 'blocks.operator_id',
                        equal: filter.id
                    }
                ],
                order: [ 
                    {
                        fieldName: 'bl_name',
                        dir: 'asc'
                    }
                ],
            };
            
            return QueryGenerator.queryGenerator(options);
        },
        fields: [
        {
                label: 'Bloco',
                ref: {
                    modelField: 'model',
                    idField: 'bl_id',
                    valueField: 'bl_name'
                }
            },
            {
                label: 'Status',
                fieldName: 'status',
                type: 'VARCHAR'
            },
        ]
    },

    oilFieldsOperatedByCompany: {
        queryStrFn: (filter) => {
            const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'oil_fields',
                    fields: [
                        ['id', 'of_id'],
                        ['name', 'of_name'],
                        'stage',
                    ]
                },
                joinTables: [],
                extraFields: [
                    ['"OilField"', 'model'],
                ],
                filters: [
                    {
                        field: 'oil_fields.operator_id',
                        equal: filter.id
                    }
                ],
                order: [ 
                    {
                        fieldName: 'of_name',
                        dir: 'asc'
                    }
                ],
            };
            
            return QueryGenerator.queryGenerator(options);
        },
        fields: [
        {
                label: 'Campo',
                ref: {
                    modelField: 'model',
                    idField: 'of_id',
                    valueField: 'of_name'
                }
            },
            {
                label: 'Estágio',
                fieldName: 'stage',
                type: 'VARCHAR'
            },
        ]
    },
};

export = queries;