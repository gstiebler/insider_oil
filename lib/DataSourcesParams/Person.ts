import db = require('../../db/models');
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
    hasMap: false
}

export = Person;