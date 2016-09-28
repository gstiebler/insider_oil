import { IQueryById } from './QueriesById'
import { IQueryParams } from '../../../common/Interfaces';
import * as TableQueries from './TableQueries';
import QueryGenerator = require('./QueryGenerator');
import * as su from '../../lib/StringUtils';

export const contracts:TableQueries.ITableQuery = {
    title: 'Contratos',
    queryStrFn: (queryParams: IQueryParams) => {
        const extraFields = [
            ['"Contract"', 'model'],
            ['"Bid"', 'bid_model'],
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
                    'situation',
                    'type',
                    'supplier',
                ]
            },
            joinTables: joinTables,
            extraFields: extraFields,
            where: filters,
            order: []
        };
        const contractsSupplierTextQuery = QueryGenerator.queryGenerator(optionsSupplierText);

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
                    'situation',
                    'type'
                ]
            },
            joinTables: joinTables,
            extraFields: extraFields,
            where: filters,
            order: []
        };
        const contractsSupplierObjQuery = QueryGenerator.queryGenerator(optionsSupplierObj);
        
        const queryWithoutOrder = contractsSupplierTextQuery + 
                        ' union ' + contractsSupplierObjQuery; 

        const orderStr = QueryGenerator.getOrderByStr(queryParams.order);

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
            label: 'Tipo',
            fieldName: 'type',
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
    ],
    tableauUrl: 'https://public.tableau.com/views/Contratos_2/Painel1?:embed=y&:display_count=yes&:toolbar=no'
}