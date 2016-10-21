'use strict';

import { await } from '../../lib/await';
import db = require('../models');
import * as QueryGenerator from './QueryGenerator';
import { IQueryParams, IBaseQueryField } from '../../../common/Interfaces';
import * as RequestLogTranslator from '../../lib/RequestLogTranslator';
import { syncifyES7 } from '../../lib/PromiseUtils';
import * as ContractQueries from './Contract';
import * as ProductionUnit from './ProductionUnit';
import * as OilField from './OilField';
import * as Block from './Block';

const queryGenerator = new QueryGenerator.QueryGenerator();

interface IQueryStrFn {
    (queryParams: IQueryParams): string; 
}

export interface ITableQuery {
    queryStrFn: IQueryStrFn;
    fields: IBaseQueryField[];
    title: string;
    recordProcessor?: (any) => any;
    tableauUrl?: string;
}

interface ITableQueries {
    [name: string]: ITableQuery;
}

const terminal:ITableQuery = {
    title: 'Terminais',
    queryStrFn: (queryParams: IQueryParams) => {
        const options:QueryGenerator.IQueryOpts = {
            table: {
                name: 'terminals',
                fields: [
                    'id',
                    'name',
                ]
            },
            joinTables: [],
            extraFields: [
                ['"Terminal"', 'model'],
            ],
            where: queryParams.filters,
            order: queryParams.order
        };
        
        return QueryGenerator.generate(options);
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
    ]
};

export const queries:ITableQueries = {
    /** Basins */
    Basins: {
        title: 'Bacias',
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
                where: queryParams.filters,
                order: queryParams.order
            };
            
            return QueryGenerator.generate(options);
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
        title: 'Empresas',
        queryStrFn: (queryParams: IQueryParams) => {
             const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'companies',
                    fields: [
                        'id',
                        'name',
                        'address',
                        'segments_text'
                    ]
                },
                extraFields: [
                    ['"Company"', 'model']
                ],
                joinTables: [],
                where: queryParams.filters,
                order: queryParams.order
            };
            
            return QueryGenerator.generate(options);
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
            {
                label: 'Segmentos',
                fieldName: 'segments_text',
                type: 'VARCHAR'
            },
        ],
        recordProcessor: record => {
            const segments = JSON.parse(record.segments_text);
            record.segments_text = segments ? segments.join(', ') : '';
        }
    },

    Shipyards: {
        title: 'Estaleiros',
        queryStrFn: (queryParams: IQueryParams) => {
            queryParams.filters.push({
                field: 'segments_text',
                like: '%Estaleiro%'
            });

             const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'companies',
                    fields: [
                        'id',
                        'name',
                        'address',
                        'segments_text'
                    ]
                },
                extraFields: [
                    ['"Company"', 'model']
                ],
                joinTables: [],
                where: queryParams.filters,
                order: queryParams.order
            };
            
            return QueryGenerator.generate(options);
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
            {
                label: 'Segmentos',
                fieldName: 'segments_text',
                type: 'VARCHAR'
            },
        ],
        recordProcessor: record => {
            const segments = JSON.parse(record.segments_text);
            record.segments_text = segments ? segments.join(', ') : '';
        }
    },
    
    Blocks: Block.Blocks,
      
    /** Persons */
    Persons: {
        title: 'Pessoas',
        queryStrFn: (queryParams: IQueryParams) => {
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
                where: queryParams.filters,
                order: queryParams.order
            };
            
            return QueryGenerator.generate(options);
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
        title: 'Sondas',
        queryStrFn: (queryParams: IQueryParams) => {
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
                        name: ['companies', 'contractor'],
                        fields: [
                            ['id', 'contractor_id'],
                            ['name', 'contractor_name'],
                        ],
                        joinField: 'drilling_rigs_onshore.contractor_id'
                    },
                    {
                        name: ['companies', 'operator'],
                        fields: [
                            ['id', 'operator_id'],
                            ['name', 'operator_name'],
                        ],
                        joinField: 'drilling_rigs_onshore.operator_id'
                    },
                ],
                extraFields: [
                    ['"DrillingRigOnshore"', 'model'],
                    ['"Terra"', 'land_sea'],
                    ['"Company"', 'contractor_model'],
                    ['"Company"', 'operator_model']
                ],
                having: queryParams.filters,
                order: []
            };
            const onshoreQryStr = QueryGenerator.generate(options);
            
            options.table.name = 'drilling_rigs_offshore';
            options.joinTables[0].joinField = 'drilling_rigs_offshore.contractor_id';
            options.joinTables[1].joinField = 'drilling_rigs_offshore.operator_id';
            options.extraFields[0] = ['"DrillingRigOffshore"', 'model'];
            options.extraFields[1] = ['"Mar"', 'land_sea'];
            const offshoreQryStr = QueryGenerator.generate(options);
            
            const orderQry = queryGenerator.getOrderByStr(queryParams.order);
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
                label: 'Contratante',
                ref: {
                    modelField: 'contractor_model',
                    idField: 'contractor_id',
                    valueField: 'contractor_name'
                }
            },
            {
                label: 'Operator',
                ref: {
                    modelField: 'operator_model',
                    idField: 'operator_id',
                    valueField: 'operator_name'
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
                label: 'Day rate (US$)',
                fieldName: 'day_rate',
                type: 'CURRENCY',
            }
        ],
        tableauUrl: 'https://public.tableau.com/views/SondasOffshore/Painel1?:embed=y&:display_count=yes&:toolbar=no'
    },
    
    /** Seismics */
    Seismics: {
        title: 'Sísmicas',
        queryStrFn: (queryParams: IQueryParams) => {
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
                where: queryParams.filters,
                order: queryParams.order
            };
            
            return QueryGenerator.generate(options);
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
        ],
        tableauUrl: 'https://public.tableau.com/views/Ssmica/Painel1?:embed=y&:display_count=yes&:toolbar=no'
    },
    
    Refineries: {
        title: 'Refinarias',
        queryStrFn: (queryParams: IQueryParams) => {
             const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'refineries',
                    fields: [
                        'id',
                        'name',
                        'capacity',
                    ]
                },
                extraFields: [
                    ['"Refinery"', 'model'],
                ],
                joinTables: [],
                where: queryParams.filters,
                order: queryParams.order
            };
            
            return QueryGenerator.generate(options);
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
                label: 'Capacidade',
                fieldName: 'capacity',
                type: 'FLOAT'
            },
        ]
    },
    
    Wells: {
        title: 'Poços',
        queryStrFn: (queryParams: IQueryParams) => {    
            const wellOpts:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'wells',
                    fields: [
                        ['id', 'well_id'],
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
                    ['"Well"', 'model_well'],
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
                where: queryParams.filters,
                order: queryParams.order
            }
            
            return QueryGenerator.generate(wellOpts);
        },
        fields: [
            {
                label: 'Nome',
                ref: {
                    modelField: 'model_well',
                    idField: 'well_id',
                    valueField: 'well_name'
                }
            },
            {
                label: 'Operador',
                ref: {
                    modelField: 'model_operator',
                    idField: 'operator_id',
                    valueField: 'operator_name'
                }
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
        ],
        tableauUrl: 'https://public.tableau.com/views/PoosPerfurados/Planilha3?:embed=y&:display_count=yes',
    },

    FPSOs: ProductionUnit.FPSOs,
    FixedProductionUnits: ProductionUnit.FixedProductionUnits,
    SemiSubmersibleProductionUnits: ProductionUnit.SemiSubmersibleProductionUnits,
    
    oilFielsdProduction: OilField.oilFielsdProduction,
    oilFieldsDevelopment: OilField.oilFieldsDevelopment,
    
    landTerminal: {
        title: 'Terminais terrestres',
        queryStrFn: (queryParams: IQueryParams) => {
            queryParams.filters.push(
                {
                    field: 'type',
                    equal: '"ONSHORE"'
                }
            );
            return terminal.queryStrFn(queryParams);
        },
        fields: terminal.fields
    },
    
    /*seaTerminal: {
        queryStrFn: (queryParams: IQueryParams) => {
            queryParams.filters.push(
                {
                    field: 'type',
                    equal: '"OFFSHORE"'
                }
            );
            return terminal.queryStrFn(queryParams);
        },
        fields: terminal.fields
    },*/
    
    Fleet: {
        title: 'Frota Transpetro',
        queryStrFn: (queryParams: IQueryParams) => {
             const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'fleet',
                    fields: [
                        'id',
                        'name',
                        'year',
                        'country',
                        'type',
                        'weight',
                    ]
                },
                extraFields: [
                    ['"Fleet"', 'model']
                ],
                joinTables: [],
                where: queryParams.filters,
                order: queryParams.order
            };
            
            return QueryGenerator.generate(options);
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
                label: 'Ano de construção',
                fieldName: 'year',
                type: 'INTEGER'
            },
            {
                label: 'País de origem',
                fieldName: 'country',
                type: 'VARCHAR'
            },
            {
                label: 'Tipo',
                fieldName: 'type',
                type: 'VARCHAR'
            },
            {
                label: 'País de origem',
                fieldName: 'country',
                type: 'VARCHAR'
            },
            {
                label: 'Porte Bruto (DWT)',
                fieldName: 'weight',
                type: 'FLOAT'
            },
        ]
    },
    
    Bids: {
        title: 'Licitações',
        queryStrFn: (queryParams: IQueryParams) => {
             const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'bids',
                    fields: [
                        'id',
                        'process_number',
                        'modality',
                        'contract_object',
                        'qty_items',
                        'opening_moment',
                        'opening_local',
                        'opening_city',
                        'opening_state',
                        'situation',
                    ]
                },
                extraFields: [
                    ['"Bid"', 'model']
                ],
                joinTables: [],
                where: queryParams.filters,
                order: queryParams.order
            };
            
            return QueryGenerator.generate(options);
        },
        fields: [
            {
                label: 'Número do processo',
                ref: {
                    modelField: 'model',
                    idField: 'id',
                    valueField: 'process_number'
                }
            },
            {
                label: 'Modalidade da licitação',
                fieldName: 'modality',
                type: 'VARCHAR'
            },
            {
                label: 'Objeto da contratação',
                fieldName: 'contract_object',
                type: 'VARCHAR'
            },
            {
                label: 'Quantidade de itens',
                fieldName: 'qty_items',
                type: 'INTEGER'
            },
            {
                label: 'Data de abertura',
                fieldName: 'opening_moment',
                type: 'DATETIME'
            },
            {
                label: 'Cidade de abertura',
                fieldName: 'opening_city',
                type: 'VARCHAR'
            },
            {
                label: 'Situação',
                fieldName: 'situation',
                type: 'VARCHAR'
            },
        ]
    },

    Boats: {
        title: 'Barcos de apoio',
        queryStrFn: (queryParams: IQueryParams) => {
             const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'boats',
                    fields: [
                        ['id', 'b_id'],
                        ['name', 'b_name'],
                        'type',
                    ]
                },
                extraFields: [
                    ['"Boat"', 'b_model'],
                    ['"Company"', 'c_model'],
                ],
                joinTables: [                    
                    {
                        name: ['companies', 'owner'],
                        fields: [
                            ['id', 'ow_id'],
                            ['name', 'ow_name'],
                        ],
                        joinField: 'boats.owner_id'
                    },                
                    {
                        name: ['companies', 'operator'],
                        fields: [
                            ['id', 'op_id'],
                            ['name', 'op_name'],
                        ],
                        joinField: 'boats.operator_id'
                    },
                ],
                where: queryParams.filters,
                order: queryParams.order
            };
            
            return QueryGenerator.generate(options);
        },
        fields: [
            {
                label: 'Nome',
                ref: {
                    modelField: 'b_model',
                    idField: 'b_id',
                    valueField: 'b_name'
                }
            },
            {
                label: 'Tipo',
                fieldName: 'type',
                type: 'VARCHAR'
            },
            {
                label: 'Empresa proprietária',
                ref: {
                    modelField: 'c_model',
                    idField: 'ow_id',
                    valueField: 'ow_name'
                }
            },
            {
                label: 'Operador',
                ref: {
                    modelField: 'c_model',
                    idField: 'op_id',
                    valueField: 'op_name'
                }
            },
        ]
    },
    
    Contracts: ContractQueries.contracts,

    MaintenanceContracts: {
        title: 'Manutenção, Construção e Montagem Offshore',
        queryStrFn: (queryParams: IQueryParams) => {
            const MAINTENANCE_ID = "12";
            queryParams.filters.push({
                field: 'contracts.segment_id',
                equal: MAINTENANCE_ID
            });
            return ContractQueries.contracts.queryStrFn(queryParams);
        },
        fields: ContractQueries.contracts.fields,
    },
    
    GasPipelines: {
        title: 'Gasodutos',
        queryStrFn: (queryParams: IQueryParams) => {
             const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'gas_pipelines',
                    fields: [
                        'id',
                        'name',
                        'state',
                        'diameter',
                        'extension',
                        'classification',
                    ]
                },
                extraFields: [
                    ['"GasPipeline"', 'model']
                ],
                joinTables: [],
                where: queryParams.filters,
                order: queryParams.order
            };
            
            return QueryGenerator.generate(options);
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
                label: 'Estado',
                fieldName: 'state',
                type: 'VARCHAR'
            },
            {
                label: 'Diâmetro (pol)',
                fieldName: 'diameter',
                type: 'FLOAT'
            },
            {
                label: 'Extensão (km)',
                fieldName: 'extension',
                type: 'FLOAT'
            },
            {
                label: 'Classificação',
                fieldName: 'classification',
                type: 'VARCHAR'
            },
        ]
    },
    
    OilPipelines: {
        title: 'Oleodutos',
        queryStrFn: (queryParams: IQueryParams) => {
             const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'gas_pipelines',
                    fields: [
                        'id',
                        'name',
                        'diameter',
                        'extension',
                    ]
                },
                extraFields: [
                    ['"OilPipeline"', 'model']
                ],
                joinTables: [],
                where: queryParams.filters,
                order: queryParams.order
            };
            
            return QueryGenerator.generate(options);
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
                label: 'Diâmetro (pol)',
                fieldName: 'diameter',
                type: 'FLOAT'
            },
            {
                label: 'Extensão (km)',
                fieldName: 'extension',
                type: 'FLOAT'
            },
        ]
    },

    News: {
        title: 'Insights',
        queryStrFn: (queryParams: IQueryParams) => {
             const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'news',
                    fields: [
                        'id',
                        'title',
                        'created_at',
                    ]
                },
                extraFields: [
                    ['"News"', 'model']
                ],
                joinTables: [],
                where: queryParams.filters,
                order: queryParams.order
            };
            
            return QueryGenerator.generate(options);
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
                label: 'Data publicação',
                fieldName: 'created_at',
                type: 'DATETIME'
            },
        ]
    },

    Production: {
        title: 'Produção',
        queryStrFn: (queryParams: IQueryParams) => {
             const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'production',
                    fields: [
                        ['id', 'production_id'],
                        'oil_production',
                        'oil_condensed_production',
                        'gas_associated_production',
                        'gas_non_associated_production',
                    ]
                },
                extraFields: [
                    ['"Production"', 'model'],
                    ['"Well"', 'well_model'],
                    ['gas_associated_production + gas_non_associated_production', 'gas_prod'],
                    ['oil_production + oil_condensed_production', 'oil_prod'],
                    ['concat(period_year, concat("/", lpad(period_month, 2, "0")))', 'formatted_date'],
                ],
                joinTables: [
                    {
                        name: 'wells',
                        fields: [
                            ['id', 'well_id'],
                            ['name', 'well_name'],
                        ],
                        joinField: 'production.well_id'
                    },
                ],
                where: queryParams.filters,
                order: queryParams.order
            };
            
            return QueryGenerator.generate(options);
        },
        fields: [
            {
                label: 'Data',
                ref: {
                    modelField: 'model',
                    idField: 'production_id',
                    valueField: 'formatted_date'
                }
            },
            {
                label: 'Poço',
                ref: {
                    modelField: 'well_model',
                    idField: 'well_id',
                    valueField: 'well_name'
                }
            },
            {
                label: 'Óleo',
                fieldName: 'oil_prod',
                type: 'FLOAT'
            },
            {
                label: 'Gás',
                fieldName: 'gas_prod',
                type: 'FLOAT'
            },
        ]
    },

    companyCards: {
        title: 'Cards',
        queryStrFn: (queryParams: IQueryParams) => {
            const filters = queryParams.filters;
            filters.push({
                field: 'companies.main_person_id',
                isNotNull: true 
            });
            const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'companies',
                    fields: [
                        ['id', 'company_id'],
                        ['name', 'company_name'],
                    ]
                },
                joinTables: [
                    {
                        name: 'persons',
                        fields: [
                            ['name', 'person_name'],
                            ['id', 'person_id'],
                            'position',
                        ],
                        joinField: 'companies.main_person_id'
                    },
                ],
                extraFields: [],
                where: filters,
                order: [ 
                    {
                        fieldName: 'company_name',
                        dir: 'asc'
                    }
                ],
            };
            
            return QueryGenerator.generate(options);
        },
        fields: []
    },

    requests: {
        title: 'Requisições',
        queryStrFn: (queryParams: IQueryParams) => {
            const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'request_log',
                    fields: [
                        'user',
                        'created_at',
                        'path',
                        'query'
                    ]
                },
                joinTables: [],
                extraFields: [],
                where: queryParams.filters,
                order: queryParams.order,
            };
            
            return QueryGenerator.generate(options);
        },
        fields: [],
        recordProcessor: record => {
            record.translation = await(syncifyES7(RequestLogTranslator.translate.bind(this, record)));
        }
    },

    requestsByUser: {
        title: 'Requisições',
        queryStrFn: (queryParams: IQueryParams) => {
            const select = " select name, count(request_log.id) qty";
            const fromStr = " from request_log "
            const join = " left outer join users "
            const joinOn = " on request_log.user = users.login "
            const groupBy = " group by request_log.user "
            const order = " ORDER BY qty desc ";
            const where = queryGenerator.getFilterStr(queryParams.filters, 'where');
            const query = select + fromStr + join + joinOn + where + groupBy + order;
            return query;
        },
        fields: []
    },
};

export function getQueryResult(queryName: string, queryParams: IQueryParams): Promise<any[]> {
    const simpleQueryType = { type: db.sequelize.QueryTypes.SELECT};
    let queryStr = queries[queryName].queryStrFn(queryParams);
    if(queryParams.searchStr) {
        queryStr = QueryGenerator.addSearchStrConditions(queryStr, 
                        queryParams.searchStr, 
                        queries[queryName].fields);
    }
    const pagination = QueryGenerator.getPaginationStr(queryParams.pagination);
    const completeQueryStr = queryStr + pagination;
    const recordsPromise = db.sequelize.query(completeQueryStr, simpleQueryType);
    
    const countQuery = 'select count(*) as count from (' + queryStr + ') t';
    const countPromise = db.sequelize.query(countQuery, simpleQueryType);
    
    return Promise.all([recordsPromise, countPromise]);
}