import { IBaseDataSourceParams } from '../../../common/Interfaces';

const Project: IBaseDataSourceParams = {
    fields: {
        name: {
            label: "Nome"
        },
        scope: {
            label: "Escopo"
        },
        value: {
            label: "Valor global",
            isCurrency: true
        },
        contractors: {
            label: "Contratadas (admin)",
            isManyToMany: true,
            comboSource: 'Company'
        },
        contractors_scope: {
            label: 'Escopo das contratadas (admin)',
            isList: true  
        },
        contractor1Persons: {
            label: "Pessoas da contratada 1 (admin)",
            isManyToMany: true,
            comboSource: 'Person'
        },
        contractor2Persons: {
            label: "Pessoas da contratada 2  (admin)",
            isManyToMany: true,
            comboSource: 'Person'
        },
        owner_id: {
            label: 'Proprietária'
        },
        oil_field_id: {
            label: 'Campo'
        },
        production_unit_id: {
            label: 'Plataforma'
        },
    },
    labelField: "name",
    gridFields: ["name", "scope", "value"],
    tableLabel: "Projetos",
    labelSingular: 'Projeto',
}

export = Project;