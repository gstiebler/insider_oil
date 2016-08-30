import { IBaseDataSourceParams } from '../../../common/Interfaces';

const Person: IBaseDataSourceParams = {
    fields: {
        name: {
            label: "Nome"
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
            label: 'Telefone',
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
        info: {
            label: "Informações",
            isMultiFieldText: true
        },
        projects: {
            label: 'Projetos',
            isProjectList: true
        }
    },
    labelField: "name",
    gridFields: ["name", "company_name"],
    tableLabel: "Pessoas",
    labelSingular: 'Pessoa',
    excelParams: {
        keyField: 'nome',
        fields: {
            'nome': 'name',
            'empresa': 'company',
            'cargo': 'position',
            'telefone': 'telephones',
            'e-mail': 'emails',
            'linkedin': 'linkedin',
            'endereço': 'address',
            'diretoria': 'directorship',
            'gerência': 'management_sector'
        }
    }
}

export = Person;