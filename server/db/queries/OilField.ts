import { IQueryById } from './QueriesById'
import { 
    IBaseDataSourceParams, 
    IBaseQueryField, 
    IQueryParams 
} from '../../../common/Interfaces';
import * as TableQueries from './TableQueries';
import * as QueryGenerator from './QueryGenerator';

const oilField:TableQueries.ITableQuery = {
    title: 'Campos',
    queryStrFn: (queryParams: IQueryParams) => {
        const options:QueryGenerator.IQueryOpts = {
            table: {
                name: 'oil_fields',
                fields: [
                    ['id', 'of_id'],
                    ['name', 'of_name'],
                    'state',
                    'basin_id'
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
            having: queryParams.filters,
            order: queryParams.order
        };
        
        return QueryGenerator.generate(options);
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
            label: 'Bacia',
            ref: {
                modelField: 'b_model',
                idField: 'b_id',
                valueField: 'b_name'
            }
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

export const oilFielsdProduction:TableQueries.ITableQuery = {
    title: 'Campos em produção',
    queryStrFn: (queryParams: IQueryParams) => {
        queryParams.filters.push({
            field: 'stage',
            equal: '"production"'
        });
        return oilField.queryStrFn(queryParams);
    },
    fields: oilField.fields,
    tableauUrl: 'https://public.tableau.com/profile/insider.oil#!/vizhome/Camposemproduo/Painel1'
};
    
export const oilFieldsDevelopment:TableQueries.ITableQuery = {
    title: 'Campos em desenvolvimento',
    queryStrFn: (queryParams: IQueryParams) => {
        queryParams.filters.push({
            field: 'stage',
            equal: '"development"'
        });
        return oilField.queryStrFn(queryParams);
    },
    fields: oilField.fields,
    tableauUrl: 'https://public.tableau.com/views/Camposemdesenvolvimento/Painel1?:embed=y&:display_count=yes&:toolbar=no'
};

export const oilFieldsByBasin:IQueryById = {
    queryStrFn: (filter) => {
        const queryParams: IQueryParams = {
            filters: [{
                 field: 'basin_id', 
                 equal: filter.id 
            }],
            order: [ { fieldName: 'of_name', dir: 'asc' } ],
            pagination: { first: 0, itemsPerPage: 100 }
        }
        return oilField.queryStrFn(queryParams);
    },
    
    fields: oilField.fields,
};