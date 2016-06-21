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

const queries:IQueriesById = {
    PersonsByProject: {
        queryStrFn: (filters) => {
            const modelsListFilter = {
                name: filters.dataSource
            }
            const modelInList = await( db.models.ModelsList.find({ where: modelsListFilter }) );
            
            var query = 'select p.id, p.name, p.position, pp.description, "Person" as model ';
            query += 'from persons p, person_projects pp ';
            query += 'where pp.person_id = p.id ';
            query += '   and pp.model_id = ' + modelInList.id;
            query += '   and pp.model_ref_id = ' + filters.project_id;
            query += ' order by p.name ';
            return query;
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
            const modelIdQuery = 'select id from models_list where name = "' + modelName + '" group by id';
            const newsIdQuery = 'SELECT news_id FROM news_models ' +
                ' where model_id = (' + modelIdQuery + ')' +
                ' and model_ref_id = ' + id;
            const newsQuery = 'select id, title, created_at, "News" as model' +
                ' from news ' +
                ' where id in (' + newsIdQuery + ')';
            return newsQuery;
        },
        fields: [
            {
                label: 'Título',
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
            const modelInList = await( db.models.ModelsList.find({ where: modelsListFilter }) );
            
            const customFilters = [
                { field: 'model_id', equal: modelInList.id },
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
            const wellOpts:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'maintenance_dates',
                    fields: [
                        'period'
                    ]
                },
                extraFields: [],
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
            
            var query = QueryGenerator.queryGenerator(wellOpts);
            return query;
        },
        fields: [
            {
                label: 'Data',
                fieldName: 'period',
                type: 'DATE'
            },
        ]
    },
};

export = queries;