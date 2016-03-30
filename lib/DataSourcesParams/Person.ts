var db = require('../../db/models');
var await = require('../../lib/await');

import BaseDataSourceParams = require('./BaseDataSourceParams');

const Person: BaseDataSourceParams = {
    fields: {
        name: {
            label: "Nome"
        },
        phone: {
            label: "Telefone"
        },
        company_name: {
            label: "Empresa"
        },
        company_id: {
            label: "Empresa"
        },
        position: {
            label: 'Cargo'
        },
        telephones: {
            label: 'Telefones',
            isList: true  
        },
        emails: {
            label: 'E-mail',
            isList: true  
        },
        linkedin: {
            label: 'Linkedin',
            isLink: true
        },
        address: {
            label: 'Endereço'
        },
        directorship: {
            label: 'Diretoria'
        },
        management_sector: {
            label: 'Gerência'
        },
        project1_model_id: {
            label: 'Projeto'
        },
        project1_ref_id: {
            label: 'Projeto'
        },
        photo: {
            label: 'Foto',
            isPhoto: true
        },
        projects: {
            label: 'Projetos',
            isProjectList: true
        }
    },
    labelField: "name",
    gridFields: ["name", "company_name"],
    tableLabel: "Pessoas",
    hasMap: false,
    queries: {
        byProject: (filters) => {
            const modelsListFilter = {
                name: filters.dataSource
            }
            const modelInList = await( db.ModelsList.find({ where: modelsListFilter }) );
            
            var query = 'select p.id, p.name, p.position, pp.description ';
            query += 'from persons p, person_projects pp ';
            query += 'where pp.person_id = p.id ';
            query += '   and pp.model_id = ' + modelInList.id;
            query += '   and pp.model_ref_id = ' + filters.project_id;
            query += ' order by p.name ';
            return query;
        }
    }
}

export = Person;