import { 
    IBaseDataSourceParams, 
    IBaseQueryField, 
    IQueryParams 
} from '../../../common/Interfaces';
import * as TableQueries from './TableQueries';
import * as QueryGenerator from './QueryGenerator';

const productionUnit:TableQueries.ITableQuery = {
    title: 'Unidades de produção',
    queryStrFn: (queryParams: IQueryParams) => {
        const options:QueryGenerator.IQueryOpts = {
            table: {
                name: 'production_units',
                fields: [
                    ['id', 'pu_id'],
                    ['name', 'pu_name'],
                    'status',
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
                {
                    name: 'blocks',
                    fields: [
                        ['id', 'b_id'],
                        ['name', 'b_name'],
                    ],
                    joinField: 'production_units.block_id'
                },
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
                ['"OilField"', 'of_model'],
                ['"Block"', 'b_model'],
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
            },
            hasFilter: true
        },
        {
            label: 'Bloco',
            ref: {
                modelField: 'b_model',
                idField: 'b_id',
                valueField: 'b_name'
            }
        },
        {
            label: 'Status',
            fieldName: 'status',
            type: 'VARCHAR',
            hasFilter: true
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
            },
            hasFilter: true
        },
        {
            label: 'Situação',
            fieldName: 'situation',
            type: 'VARCHAR',
            hasFilter: true
        },
    ]
};

export const FPSOs:TableQueries.ITableQuery = {
    title: 'FPSOs',
    queryStrFn: (queryParams: IQueryParams) => {
        queryParams.filters.push(
            {
                field: 'type',
                equal: '"FPSO"'
            }
        );
        return productionUnit.queryStrFn(queryParams);
    },
    fields: productionUnit.fields,
    tableauUrl: 'https://public.tableau.com/views/FPSO/Painel1?:embed=y&:display_count=yes&:toolbar=no',
};
    
export const FixedProductionUnits:TableQueries.ITableQuery = {
    title: 'Plataformas fixas',
    queryStrFn: (queryParams: IQueryParams) => {
        queryParams.filters.push(
            {
                field: 'type',
                equal: '"FIXED"'
            }
        );
        return productionUnit.queryStrFn(queryParams);
    },
    fields: productionUnit.fields,
    tableauUrl: 'https://public.tableau.com/views/Fixas/Painel1?:embed=y&:display_count=yes&:toolbar=no'
};
    
export const SemiSubmersibleProductionUnits:TableQueries.ITableQuery = {
    title: 'Semi-subversíveis',
    queryStrFn: (queryParams: IQueryParams) => {
        queryParams.filters.push(
            {
                field: 'type',
                equal: '"SEMI"'
            }
        );
        return productionUnit.queryStrFn(queryParams);
    },
    fields: productionUnit.fields,
    tableauUrl: 'https://public.tableau.com/views/Semi/Painel1?:embed=y&:display_count=yes&:toolbar=no',
};