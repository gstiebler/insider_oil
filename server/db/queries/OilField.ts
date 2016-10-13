import { 
    IBaseDataSourceParams, 
    IBaseQueryField, 
    IQueryParams 
} from '../../../common/Interfaces';
import * as TableQueries from './TableQueries';
import * as QueryGenerator from './QueryGenerator';

const oilField = {
    title: 'Campos',
    queryStrFn: (queryParams: IQueryParams, where) => {
        const options:QueryGenerator.IQueryOpts = {
            table: {
                name: 'oil_fields',
                fields: [
                    ['id', 'of_id'],
                    ['name', 'of_name'],
                    'state',
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
            where,
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
        const where =  {
            field: 'stage',
            equal: '"production"'
        };
        return oilField.queryStrFn(queryParams, [where]);
    },
    fields: oilField.fields,
    tableauUrl: 'https://public.tableau.com/profile/insider.oil#!/vizhome/Camposemproduo/Painel1'
};
    
export const oilFieldsDevelopment:TableQueries.ITableQuery = {
    title: 'Campos em desenvolvimento',
    queryStrFn: (queryParams: IQueryParams) => {
        const where =  {
            field: 'stage',
            equal: '"development"'
        };
        return oilField.queryStrFn(queryParams, [where]);
    },
    fields: oilField.fields,
    tableauUrl: 'https://public.tableau.com/views/Camposemdesenvolvimento/Painel1?:embed=y&:display_count=yes&:toolbar=no'
};