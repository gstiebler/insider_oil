var await = require('../../lib/await');
import db = require('../models');

/*
interface IField {
    label: string;
}

interface ISimpleField extends IField {
    fieldName: string;
    type: string;
}

interface IRef {
    modelField: string;
    idField: string;
    valueField: string;
}

interface IRefField extends IField {
    ref: IRef;
}
*/

/** function that returns the SQL query string */
interface IQueryStrFn {
    (filters:any): string; 
}

interface IQueryById {
    queryStrFn: IQueryStrFn;
    fields: any[];
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
            var query = 'select id, attached, date, "ComercialDeclaration" as model ';
            query += 'from comercial_declarations ';
            query += 'where block_id = ' + filter.id;
            query += ' order by date ';
            return query;
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
    }
};

export = queries;