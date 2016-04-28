var await = require('../../lib/await');
import db = require('../models');
import BaseQuery = require('./BaseQuery');
import QueryGenerator = require('./QueryGenerator');

/** function that returns the SQL query string */
interface IQueryStrFn {
    (filters:any): string; 
}

interface IQueryById {
    queryStrFn: IQueryStrFn;
    fields: BaseQuery.IField[];
}

interface IQueriesById {
    [name: string]: IQueryById;
}

const queries:IQueriesById = {
    PersonsByProject: {
        queryStrFn: (filters) => {
            const modelsListFilter = {
                name: filters.dataSource
            }
            const modelInList = await( db.models.ModelsList.find({ where: modelsListFilter }) );
            
            var query = 'select p.id, p.name, p.position, pp.description, "Person" as model ';
            query += 'from persons p, person_projects pp ';
            query += 'where pp.person_id = p.id ';
            query += '   and pp.model_id = ' + modelInList.id;
            query += '   and pp.model_ref_id = ' + filters.project_id;
            query += ' order by p.name ';
            return query;
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
                label: 'Cargo',
                fieldName: 'position',
                type: 'VARCHAR'
            },
            {
                label: 'Descrição',
                fieldName: 'description',
                type: 'VARCHAR'
            }
        ]
    },
    
    NewsByObject: {
        queryStrFn: (filters) => {
            const modelName = filters.modelName;
            const id = filters.id;
            const modelIdQuery = 'select id from models_list where name = "' + modelName + '" group by id';
            const newsIdQuery = 'SELECT news_id FROM news_models ' +
                ' where model_id = (' + modelIdQuery + ')' +
                ' and model_ref_id = ' + id;
            const newsQuery = 'select id, title, created_at, "News" as model' +
                ' from news ' +
                ' where id in (' + newsIdQuery + ')';
            return newsQuery;
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
                label: 'Criada em',
                fieldName: 'created_at',
                type: 'DATE'
            },
        ]
    },
    
    ambientalLicenseByBlock: {
        queryStrFn: (filter) => {
            var query = 'select al.id, license, start, end, enterprise, entrepreneur, "AmbientalLicense" as model ';
            query += 'from ambiental_licenses al, ambiental_license_blocks alb ';
            query += 'where alb.ambiental_license_id = al.id ';
            query += '  and alb.block_id = ' + filter.id;
            query += ' order by al.license ';
            return query;
        },
        fields: [
            {
                label: 'Nro da licença',
                ref: {
                    modelField: 'model',
                    idField: 'id',
                    valueField: 'license'
                }
            },
            {
                label: 'Emissão',
                fieldName: 'start',
                type: 'DATE'
            },
            {
                label: 'Vencimento',
                fieldName: 'end',
                type: 'DATE'
            },
            {
                label: 'Empreendimento',
                fieldName: 'enterprise',
                type: 'VARCHAR'
            },
            {
                label: 'Empreendedor',
                fieldName: 'entrepreneur',
                type: 'VARCHAR'
            }
        ]
    },
    
    comercialDeclarationsByBlock: {
        queryStrFn: (filter) => {
            const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'comercial_declarations',
                    fields: [ 'id', 'attached', 'date', ]
                },
                extraFields: [ ['"ComercialDeclaration"', 'model'] ],
                joinTables: [],
                filters: [ { field: 'block_id', equal: filter.id } ],
                order: [ { fieldName: 'date', dir: 'asc' } ]
            };
            
            return QueryGenerator.queryGenerator(options);
        },
        fields: [
            {
                label: 'Anexado',
                ref: {
                    modelField: 'model',
                    idField: 'id',
                    valueField: 'attached'
                }
            },
            {
                label: 'Data',
                fieldName: 'date',
                type: 'DATE'
            }
        ]
    },
    
    seismicsByBlock: {
        queryStrFn: (filter) => {
            const options:QueryGenerator.IQueryOpts = {
                table: {
                    name: 'seismics',
                    fields: [ 'id', 'process', 'authorized_company',
                        'dou_publi_date', 'end_date', 'authorized_technologies' ]
                },
                extraFields: [ ['"Seismic"', 'model'] ],
                joinTables: [],
                filters: [ { field: 'block_id', equal: filter.id } ],
                order: [ { fieldName: 'process', dir: 'asc' } ]
            };
            
            return QueryGenerator.queryGenerator(options);
        },
        fields: [
            {
                label: 'Processo',
                ref: {
                    modelField: 'model',
                    idField: 'id',
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
                label: 'Tecnologias autorizadas',
                fieldName: 'authorized_technologies',
                type: 'VARCHAR'
            },
        ]
    },
    
    wellsByBlock: {
        queryStrFn: (filter) => {
            function getSubQuery(onOffStr) {
                const query = 'select w.id, w.name as well_name, w.start, "Well" as model, dr.name as drilling_rig_name, ' +
                        'dr.id as drilling_rig_id, "DrillingRigO' + onOffStr + 'shore" as drilling_rig_model ' +
                    ' from wells w, drilling_rigs_o' + onOffStr + 'shore dr ' +
                    ' where w.drilling_rig_o'+ onOffStr +'shore_id = dr.id ' +
                        ' and w.block_id = ' + filter.id;
                return query;
            }
            
            var query = getSubQuery('n') + ' union ' + getSubQuery('ff') + ' order by well_name';
            return query;
        },
        fields: [
            {
                label: 'Nome',
                ref: {
                    modelField: 'model',
                    idField: 'id',
                    valueField: 'well_name'
                }
            },
            {
                label: 'Início',
                fieldName: 'start',
                type: 'DATE'
            },
            {
                label: 'Sonda',
                ref: {
                    modelField: 'drilling_rig_model',
                    idField: 'drilling_rig_id',
                    valueField: 'drilling_rig_name'
                }
            }
        ]
    }
};

export = queries;