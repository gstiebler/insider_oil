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
        updates: {
            label: 'Atualizações'
        },
        segment_type: {
            label: 'Segmento'
        },
        stage: {
            label: 'Fase'
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
            queryName: 'personsOfOwnerInProject',
            title: 'Pessoas da contratante'
        },
    ]
}

export = Project;