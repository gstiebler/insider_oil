import { IQueryById } from './QueriesById'
import { IQueryParams } from '../../../common/Interfaces';
import * as TableQueries from './TableQueries';
import QueryGenerator = require('./QueryGenerator');
import * as ContractQueries from './Contract';
import { await } from '../../lib/await';
import { 
    IProjectJsonField, 
    IBaseQueryField, 
    IFilter 
} from '../../../common/Interfaces';
import db = require('../models');

function baseProjectOpts():QueryGenerator.IQueryOpts {
    return {
        table: {
            name: 'projects',
            fields: [
                ['id', 'p_id'],
                ['name', 'p_name'],
                'value'
            ]
        },
        extraFields: [
            ['"Project"', 'p_model'],
            ['"Company"', 'c_model'],
        ],
        joinTables: [                    
            {
                name: 'companies',
                fields: [
                    ['id', 'c_id'],
                    ['name', 'c_name'],
                ],
                joinField: 'projects.owner_id'
            },
        ],
        where: [],
        order: []
    }
}

const baseFields:IBaseQueryField[] = [
    {
        label: 'Nome',
        ref: {
            modelField: 'p_model',
            idField: 'p_id',
            valueField: 'p_name'
        }
    },
    {
        label: 'Contratante',
        ref: {
            modelField: 'c_model',
            idField: 'c_id',
            valueField: 'c_name'
        }
    },
    {
        label: 'Valor',
        fieldName: 'value',
        type: 'CURRENCY'
    },
];

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
    fields: ContractQueries.contracts.fields
}

export const personsOfContractedInProject:IQueryById = {
    queryStrFn: (filter) => {
        const Project = db.models.Project;
        const project = await( Project.findById(filter.id) );
        const jsonField:IProjectJsonField = JSON.parse(project.json_field);
        const persons_id = jsonField.contractors[filter.index].persons_id;

        const queryParams: IQueryParams = {
            filters: [ {
                 field: 'persons.id', 
                 in: persons_id
            } ],
            order: [],
            pagination: { first: 0, itemsPerPage: 100 }
        };
        return TableQueries.queries['Persons'].queryStrFn(queryParams);
    },
    fields: TableQueries.queries['Persons'].fields
}

export const personsOfOwnerInProject:IQueryById = {
    queryStrFn: (filter) => {
        const Project = db.models.Project;
        const project = await( Project.findById(filter.id) );
        const jsonField:IProjectJsonField = JSON.parse(project.json_field);
        const owner_persons_id = jsonField.owner_persons_id;

        const queryParams: IQueryParams = {
            filters: [ {
                 field: 'persons.id', 
                 in: owner_persons_id
            } ],
            order: [{
                fieldName: 'persons.name',
                dir: 'asc'
            }],
            pagination: { first: 0, itemsPerPage: 100 }
        };
        return TableQueries.queries['Persons'].queryStrFn(queryParams);
    },
    fields: TableQueries.queries['Persons'].fields
}

export const projectsTargetSales:IQueryById = {
    queryStrFn: (filter) => {
        const opts = baseProjectOpts();
        opts.where.push({
            field: 'projects.stage',
            equal: '"' + filter.fase + '"'
        });
        opts.where.push({
            field: 'projects.segment_type',
            equal: '"' + filter.type + '"'
        });
        
        var query = QueryGenerator.generate(opts);
        return query;
    },
    fields: baseFields
}

export const projectTypesAndStages:IQueryById = {
    queryStrFn: (filter) => {
        const select = 'select segment_type, stage ';
        const fromStr = ' from projects ';
        const group = ' group by segment_type, stage ';
        const query = select + fromStr + group;
        return query;
    },
    fields: []
}

export const personRelatedProjects:IQueryById = {
    queryStrFn: (filter) => {
        const opts = baseProjectOpts();
        const queryGenerator = new QueryGenerator.QueryGenerator();
        queryGenerator.getFilterStr = (filters: IFilter[], filterKeyword: string, aliasMap?):string => {
            const ownerFilter = ' JSON_contains(json_field, \'"' + filter.id + '"\', "$.owner_persons_id") > 0 ';
            const contractedsFilter = ' JSON_contains(JSON_EXTRACT(json_field, "$.contractors[*].persons_id"), \'"' + filter.id + '"\') > 0';
            return ' where ' + ownerFilter + ' or ' + contractedsFilter;
        };
        
        var query = QueryGenerator.generate(opts, queryGenerator);
        return query;
    },
    fields: baseFields
}

export const contractRelatedProjects:IQueryById = {
    queryStrFn: (filter) => {
        const opts = baseProjectOpts();
        const queryGenerator = new QueryGenerator.QueryGenerator();
        queryGenerator.getFilterStr = (filters: IFilter[], filterKeyword: string, aliasMap?):string => {
            const contractedsFilter = ' JSON_contains(JSON_EXTRACT(json_field, "$.contractors[*].contracts_id"), \'"' + filter.id + '"\') > 0';
            return ' where ' + contractedsFilter;
        };
        
        var query = QueryGenerator.generate(opts, queryGenerator);
        return query;
    },
    fields: baseFields
}

export const objectRelatedProjects:IQueryById = {
    queryStrFn: (filter) => {
        const whereOpts = {
            type: 'ProjectObjects',
            dest_model: filter.modelName,
            dest_id: filter.id
        };
        const projectAssocs:any[] = await( db.models.Association.findAll( { where: whereOpts } ) );
        const projectIds:number[] = projectAssocs.map( p => { return p.src_id } );

        const opts = baseProjectOpts();
        opts.where.push({
            field: 'projects.id',
            in: projectIds
        });
        
        var query = QueryGenerator.generate(opts);
        return query;
    },
    fields: baseFields
}