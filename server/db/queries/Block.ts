import { IQueryById } from './QueriesById'
import { 
    IBaseDataSourceParams, 
    IBaseQueryField, 
    IQueryParams 
} from '../../../common/Interfaces';
import * as TableQueries from './TableQueries';
import * as QueryGenerator from './QueryGenerator';

export const Blocks:TableQueries.ITableQuery = {
    title: 'Blocos',
    queryStrFn: (queryParams: IQueryParams) => {
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
    ],
    tableauUrl: 'https://public.tableau.com/views/Blocos/Painel1?:embed=y&:display_count=yes&:toolbar=no'
};

export const blocksByBasin:IQueryById = {
    queryStrFn: (filter) => {
        const queryParams: IQueryParams = {
            filters: [{
                 field: 'basin_id', 
                 equal: filter.id 
            }],
            order: [ { fieldName: 'block_name', dir: 'asc' } ],
            pagination: { first: 0, itemsPerPage: 100 }
        }
        return Blocks.queryStrFn(queryParams);
    },
    
    fields: Blocks.fields,
};