import { IQueryById } from './QueriesById'
import { IQueryParams } from '../../../common/Interfaces';
import * as TableQueries from './TableQueries';
import QueryGenerator = require('./QueryGenerator');
import * as ContractQueries from './Contract';
import { await } from '../../lib/await';
import { IProjectJsonField } from '../../../common/Interfaces';
import db = require('../models');

export const projectsOfObject:IQueryById = {
    queryStrFn: (filter) => {
        const Association = db.models['Association'];
        const qryOpt = {
            where: {
                type: 'ProjectObjects',
                dest_model: filter.model,
                dest_id: filter.obj_id
            }
        }
        const associations:any[] = await( Association.findAll(qryOpt) );
        const projectsIds = associations.map(a => {
            return a.src_id
        });
        const options:QueryGenerator.IQueryOpts = {
            table: {
                name: 'projects',
                fields: [
                    ['name', 'p_name'],
                    ['id', 'p_id'],
                    'value'
                ]
            },
            joinTables: [],
            extraFields: [
                ['"Project"', 'p_model'],
            ],
            where: [
                {
                    field: 'projects.id',
                    in: projectsIds
                }
            ],
            order: [ 
                {
                    fieldName: 'p_name',
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
                modelField: 'p_model',
                idField: 'p_id',
                valueField: 'p_name'
            }
        },
        {
            label: 'Valor',
            fieldName: 'value',
            type: 'CURRENCY'
        }
    ]
};

export const contractsOfContractedInProject:IQueryById = {
    queryStrFn: (filter) => {
        const Project = db.models.Project;
        const project = await( Project.findById(filter.id) );
        const jsonField:IProjectJsonField = JSON.parse(project.json_field);
        const contracts_id = jsonField.contractors[filter.index].contracts_id;

        const queryParams: IQueryParams = {
            filters: [ {
                 field: 'contracts.id', 
                 in: contracts_id
            } ],
            order: [ { fieldName: 'start', dir: 'desc' } ],
            pagination: { first: 0, itemsPerPage: 100 }
        };
        return ContractQueries.contracts.queryStrFn(queryParams);
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
    ]
}