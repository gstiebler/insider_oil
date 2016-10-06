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
        owner_id: {
            label: 'Proprietária'
        },
        oil_field_id: {
            label: 'Campo'
        },
        updates: {
            label: 'Atualizações'
        },
        segment_type: {
            label: 'Segmento'
        },
        stage: {
            label: 'Fase'
        },
        production_unit_id: {
            label: 'Plataforma'
        },
        objects: {
            label: 'Objetos (admin)',
            isProjectList: true
        },
        photo: {
            label: 'Foto',
            isPhoto: true
        },
        json_field: {
            label: 'json_field (admin)',
        },
    },
    labelField: "name",
    gridFields: ["name", "scope", "value"],
    tableLabel: "Projetos",
    labelSingular: 'Projeto',
    referencedObjectsOnView:  [
        {
            queryName: 'personsFromProjectContracted1',
            title: 'Enaval (contrato global)'
        },
        {
            queryName: 'personsFromProjectContracted2',
            title: 'Radix (engenharia)'
        },
    ]
}

export = Project;