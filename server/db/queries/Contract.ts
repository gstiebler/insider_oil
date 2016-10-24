import { IQueryById } from './QueriesById'
import { IQueryParams } from '../../../common/Interfaces';
import * as TableQueries from './TableQueries';
import * as QueryGenerator from './QueryGenerator';
import * as su from '../../lib/StringUtils';

const queryGenerator = new QueryGenerator.QueryGenerator();

export const contracts:TableQueries.ITableQuery = {
    title: 'Contratos',
    queryStrFn: (queryParams: IQueryParams) => {
        const extraFields = [
            ['"Contract"', 'model'],
            ['"Bid"', 'bid_model'],
            ['"Company"', 'co_model'],
            ['datediff(contracts.end, contracts.start) + 1', 'duration'],
            ['if(show_day_rate, value / (datediff(contracts.end, contracts.start) + 1), NULL)', 'day_rate']
        ];

        const joinTables = [
            {
                name: 'bids',
                fields: [
                    ['id', 'bid_id'],
                    ['process_number', 'bid_process_number'],
                ],
                joinField: 'contracts.bid_id'
            },
            {
                name: 'industry_segments',
                fields: [
                    ['id', 'is_id'],
                    ['name', 'is_name'],
                ],
                joinField: 'contracts.segment_id'
            },
            {
                name: ['companies', 'co'],
                fields: [
                    ['id', 'co_id'],
                    ['name', 'co_name'],
                ],
                joinField: 'contracts.contractor_id'
            },
        ];

        const filters = queryParams.filters;
        filters.push({
            field: 'supplier',
            isNotNull: true
        });

        const optionsSupplierText:QueryGenerator.IQueryOpts = {
            table: {
                name: 'contracts',
                fields: [
                    ['id', 'c_id'],
                    ['contract_object', 'c_contract_object'],
                    'start',
                    'end',
                    'value',
                    'contractor_id',
                    ['situation', 'c_situation'],
                    'type',
                    'supplier',
                ]
            },
            joinTables: joinTables,
            extraFields: extraFields,
            where: filters,
            order: []
        };
        const contractsSupplierTextQuery = QueryGenerator.generate(optionsSupplierText);

        // must be the first to match 'supplier' field order in select
        // of the previous query
        joinTables.splice(0, 0, {
            name: 'companies',
            fields: [
                ['name', 'supplier'],
            ],
            joinField: 'contracts.supplier_obj_id'                
        });

        filters[filters.length - 1] = {
            field: 'supplier_obj_id',
            isNotNull: true
        };
        const optionsSupplierObj:QueryGenerator.IQueryOpts = {
            table: {
                name: 'contracts',
                fields: [
                    ['id', 'c_id'],
                    ['contract_object', 'c_contract_object'],
                    'start',
                    'end',
                    'value',
                    'contractor_id',
                    ['situation', 'c_situation'],
                    'type'
                ]
            },
            joinTables: joinTables,
            extraFields: extraFields,
            where: filters,
            order: []
        };
        const contractsSupplierObjQuery = QueryGenerator.generate(optionsSupplierObj);
        
        const queryWithoutOrder = contractsSupplierTextQuery + 
                        ' union ' + contractsSupplierObjQuery; 

        const orderStr = queryGenerator.getOrderByStr(queryParams.order);

        return queryWithoutOrder + ' ' + orderStr;
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
            label: 'Fornecedor',
            fieldName: 'supplier',
            type: 'VARCHAR'
        },
        {
            label: 'Contratante',
            ref: {
                modelField: 'co_model',
                idField: 'co_id',
                valueField: 'co_name'
            },
            hasFilter: true
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
            fieldName: 'c_situation',
            type: 'VARCHAR',
            hasFilter: true
        },
        {
            label: 'Tipo',
            fieldName: 'type',
            type: 'VARCHAR',
            hasFilter: true
        },
        {
            label: 'Segmento',
            fieldName: 'is_name',
            type: 'VARCHAR',
            hasFilter: true
        },
    ],
    tableauUrl: 'https://public.tableau.com/views/Contratos_2/Painel1?:embed=y&:display_count=yes&:toolbar=no'
}