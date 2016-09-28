import { IQueryById } from './QueriesById'
import { IQueryParams } from '../../../common/Interfaces';
import * as TableQueries from './TableQueries';
import QueryGenerator = require('./QueryGenerator');
import * as su from '../../lib/StringUtils';

export const personsByCompany:IQueryById = {
    queryStrFn: (filter) => {
        const queryParams: IQueryParams = {
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
};

export const blocksOperatedByCompany:IQueryById = {
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
            where: [
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
};

export const oilFieldsOperatedByCompany:IQueryById = {
    queryStrFn: (filter) => {
        const options:QueryGenerator.IQueryOpts = {
            table: {
                name: 'oil_fields',
                fields: [
                    ['id', 'of_id'],
                    ['name', 'of_name'],
                ]
            },
            joinTables: [],
            extraFields: [
                ['"OilField"', 'model'],
                ['if(stage = "production", "Produção", "Desenvolvimento")', 'formatted_stage'],
            ],
            where: [
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
            fieldName: 'formatted_stage',
            type: 'VARCHAR'
        },
    ]
};

export const blocksConcessionaryByCompany:IQueryById = {
    queryStrFn: (filter) => {
        const options:QueryGenerator.IQueryOpts = {
            table: {
                name: 'block_concessionaries',
                fields: [
                    'prop'
                ]
            },
            joinTables: [
                {
                    name: 'blocks',
                    fields: [
                        ['id', 'bl_id'],
                        ['name', 'bl_name'],
                        'status'
                    ],
                    joinField: 'block_concessionaries.block_id'
                },
            ],
            extraFields: [
                ['"Block"', 'model'],
            ],
            where: [
                {
                    field: 'block_concessionaries.company_id',
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
    recordProcessor: record => {
        record.formatted_prop = su.formatPercentage(record.prop);
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
        {
            label: '%',
            fieldName: 'formatted_prop',
            type: 'FLOAT'
        },
    ]
};


export const oilFieldConcessionaryByCompany:IQueryById = {
    queryStrFn: (filter) => {
        const options:QueryGenerator.IQueryOpts = {
            table: {
                name: 'oil_field_concessionaries',
                fields: [
                    'prop'
                ]
            },
            joinTables: [
                {
                    name: 'oil_fields',
                    fields: [
                        ['id', 'of_id'],
                        ['name', 'of_name'],
                    ],
                    joinField: 'oil_field_concessionaries.oil_field_id'
                },
            ],
            extraFields: [
                ['"OilField"', 'model'],
                ['if(stage = "production", "Produção", "Desenvolvimento")', 'formatted_stage'],
            ],
            where: [
                {
                    field: 'oil_field_concessionaries.company_id',
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
    recordProcessor: record => {
        record.formatted_prop = su.formatPercentage(record.prop);
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
            fieldName: 'formatted_stage',
            type: 'VARCHAR'
        },
        {
            label: '%',
            fieldName: 'formatted_prop',
            type: 'FLOAT'
        },
    ]
};

export const drillingRigsByContractor:IQueryById = {
    queryStrFn: (filter) => {
        const queryParams: IQueryParams = {
            filters: [ { field: 'contractor_id', equal: filter.id } ],
            order: [ { fieldName: 'dr_name', dir: 'asc' } ],
            pagination: { first: 0, itemsPerPage: 100 }
        };
        return TableQueries.queries['DrillingRigs'].queryStrFn(queryParams);
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
    ]
};

export const drillingRigsByOperator:IQueryById = {
    queryStrFn: (filter) => {
        const queryParams: IQueryParams = {
            filters: [ { field: 'operator_id', equal: filter.id } ],
            order: [ { fieldName: 'dr_name', dir: 'asc' } ],
            pagination: { first: 0, itemsPerPage: 100 }
        };
        return TableQueries.queries['DrillingRigs'].queryStrFn(queryParams);
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
    ]
};