'use strict';

import { await } from '../../lib/await';
import db = require('../models');
import * as QueryGenerator from './QueryGenerator';
import * as TableQueries from './TableQueries';
import * as su from '../../lib/StringUtils';
import { IQueryParams, IBaseQueryField } from '../../../common/Interfaces';
import Sequelize = require('sequelize');
import * as CompanyQueries from './Company';
import * as ProjectQueries from './Project';

const models:Sequelize.ModelsHashInterface = db.models; 

/** function that returns the SQL query string */
interface IQueryStrFn {
    (filters:any): string; 
}

export interface IQueryById {
    queryStrFn: IQueryStrFn;
    fields: IBaseQueryField[];
    recordProcessor?: any;
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
        where: [
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

export const queries:IQueriesById = {
    PersonsByProject: {
        queryStrFn: (filters) => {
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
                where: [
                    {
                        field: 'person_projects.model_name',
                        equal: '"' + filters.dataSource + '"'
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
            const newsIdQuery = 'SELECT nm.news_id FROM news_models nm ' +
                ' where nm.model_name = "' + modelName + '" ' +
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
            const customFilters = [
                { field: 'model_name', equal: '"' + filters.dataSource + '"'},
                { field: 'obj_id', equal:filters.obj_id  },
            ];
            const queryParams: IQueryParams = {
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
            const contractProjectsFilters = {
                model_name: filters.dataSource,
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

            const queryParams: IQueryParams = {
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
                where: [ { field: 'block_id', equal: filter.id } ],
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
                where: [ { field: 'block_id', equal: filter.id } ],
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
                where: [ { field: 'block_id', equal: filter.id } ],
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
                where: [ { field: 'oil_field_id', equal: filter.id } ],
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
                where: [
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
    
    contractsBySupplier: {
        queryStrFn: (filter) => {
            const queryParams: IQueryParams = {
                filters: [ { field: 'supplier_obj_id', equal: filter.id } ],
                order: [ { fieldName: 'start', dir: 'desc' } ],
                pagination: { first: 0, itemsPerPage: 100 }
            };
            return TableQueries.queries['Contracts'].queryStrFn(queryParams);
        },
        fields: [
            {
                label: 'Objeto da contratação',
                ref: {
                    modelField: 'model',
                    idField: 'c_id',
                    valueField: 'c_contract_object'
                }
            },
            {
                label: 'Início da vigência',
                fieldName: 'start',
                type: 'DATE'
            },
            {
                label: 'Fim da vigência',
                fieldName: 'end',
                type: 'DATE'
            },
            {
                label: 'Duração (dias)',
                fieldName: 'duration',
                type: 'INTEGER'
            },
            {
                label: 'Day rate',
                fieldName: 'day_rate',
                type: 'CURRENCY'
            },
            {
                label: 'Valor',
                fieldName: 'value',
                type: 'CURRENCY'
            },
            {
                label: 'Situação',
                fieldName: 'situation',
                type: 'VARCHAR'
            },
            {
                label: 'Licitação',
                ref: {
                    modelField: 'bid_model',
                    idField: 'bid_id',
                    valueField: 'bid_process_number'
                }
            },
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
                where: [
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
                        //'owner',
                        'situation'
                    ]
                },
                joinTables: [
                    {
                        name: ['companies', 'owner'],
                        fields: [
                            ['id', 'ow_id'],
                            ['name', 'ow_name'],
                        ],
                        joinField: 'production_units.owner_id'
                    },
                    {
                        name: ['companies', 'operator'],
                        fields: [
                            ['id', 'op_id'],
                            ['name', 'op_name'],
                        ],
                        joinField: 'production_units.operator_id'
                    },
                ],
                extraFields: [
                    ['"ProductionUnit"', 'model'],
                ],
                where: [
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
                ref: {
                    modelField: 'ow_model',
                    idField: 'ow_id',
                    valueField: 'ow_name'
                }
            },
            {
                label: 'Operador',
                ref: {
                    modelField: 'op_model',
                    idField: 'op_id',
                    valueField: 'op_name'
                }
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
                        //'owner',
                        'situation'
                    ]
                },
                joinTables: [
                    {
                        name: ['companies', 'owner'],
                        fields: [
                            ['id', 'ow_id'],
                            ['name', 'ow_name'],
                        ],
                        joinField: 'production_units.owner_id'
                    },
                    {
                        name: ['companies', 'operator'],
                        fields: [
                            ['id', 'op_id'],
                            ['name', 'op_name'],
                        ],
                        joinField: 'production_units.operator_id'
                    },
                ],
                extraFields: [
                    ['"ProductionUnit"', 'model'],
                ],
                where: [
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
                ref: {
                    modelField: 'ow_model',
                    idField: 'ow_id',
                    valueField: 'ow_name'
                }
            },
            {
                label: 'Operador',
                ref: {
                    modelField: 'op_model',
                    idField: 'op_id',
                    valueField: 'op_name'
                }
            },
            {
                label: 'Situação',
                fieldName: 'situation',
                type: 'VARCHAR'
            },
        ]
    },
    
    productionUnitsByOperator: {
        queryStrFn: (filter) => {
            const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'production_units',
                    fields: [
                        ['id', 'pu_id'],
                        ['name', 'pu_name'],
                        'situation'
                    ]
                },
                joinTables: [
                    {
                        name: 'companies',
                        fields: [
                            ['id', 'ow_id'],
                            ['name', 'ow_name'],
                        ],
                        joinField: 'production_units.owner_id'
                    },
                ],
                extraFields: [
                    ['"ProductionUnit"', 'model'],
                    ['"Company"', 'ow_model'],
                ],
                where: [
                    {
                        field: 'production_units.operator_id',
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
                ref: {
                    modelField: 'ow_model',
                    idField: 'ow_id',
                    valueField: 'ow_name'
                }
            },
            {
                label: 'Situação',
                fieldName: 'situation',
                type: 'VARCHAR'
            },
        ]
    },
    
    productionUnitsByOwner: {
        queryStrFn: (filter) => {
            const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'production_units',
                    fields: [
                        ['id', 'pu_id'],
                        ['name', 'pu_name'],
                        'situation'
                    ]
                },
                joinTables: [
                    {
                        name: 'companies',
                        fields: [
                            ['id', 'op_id'],
                            ['name', 'op_name'],
                        ],
                        joinField: 'production_units.operator_id'
                    },
                ],
                extraFields: [
                    ['"ProductionUnit"', 'model'],
                    ['"Company"', 'op_model'],
                ],
                where: [
                    {
                        field: 'production_units.owner_id',
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
                label: 'Operador',
                ref: {
                    modelField: 'op_model',
                    idField: 'op_id',
                    valueField: 'op_name'
                }
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
            options.where = [
                {
                    field: 'wells.drilling_rig_onshore_id',
                    equal: filter.id 
                }
            ]
            return QueryGenerator.queryGenerator(options);
        },
        fields: wellsByDrillingRigOffshore.fields
    },

    personsByCompany: CompanyQueries.personsByCompany,
    blocksOperatedByCompany: CompanyQueries.blocksOperatedByCompany,
    oilFieldsOperatedByCompany: CompanyQueries.oilFieldsOperatedByCompany,
    blocksConcessionaryByCompany: CompanyQueries.blocksConcessionaryByCompany,
    oilFieldConcessionaryByCompany: CompanyQueries.oilFieldConcessionaryByCompany,
    drillingRigsByContractor: CompanyQueries.drillingRigsByContractor,
    drillingRigsByOperator: CompanyQueries.drillingRigsByOperator,
    contractsByContractor: CompanyQueries.contractsByContractor,

    projectsOfObject: ProjectQueries.projectsOfObject,
    contractsOfContractedInProject: ProjectQueries.contractsOfContractedInProject,
    personsOfContractedInProject: ProjectQueries.personsOfContractedInProject,
    personsOfOwnerInProject: ProjectQueries.personsOfOwnerInProject,
    projectsTargetSales: ProjectQueries.projectsTargetSales,
    projectTypesByFase: ProjectQueries.projectTypesByFase,

    boatsByOwner: {
        queryStrFn: (filters) => {
            const customFilters = [
                { field: 'owner_id', equal: filters.id},
            ];
            const queryParams: IQueryParams = {
                filters: customFilters,
                order: [ { fieldName: 'boats.name', dir: 'asc' } ],
                pagination: { first: 0, itemsPerPage: 100 }
            };
            return TableQueries.queries['Boats'].queryStrFn(queryParams);
        },
        fields: TableQueries.queries['Boats'].fields
    },
};