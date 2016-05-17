import db = require('../../db/models');
import BaseDataSourceParams = require('./BaseDataSourceParams');

const GasPipeline: BaseDataSourceParams = {
    fields: {
        name: {
            label: "Nome"
        },
        state: {
            label: "Estado"
        },
        diameter: {
            label: "Diâmetro (pol)"
        },
        extension: {
            label: 'Extensão (km)'
        },
        classification: {
            label: 'Classificação',
        },
        src_instalation_text: {
            label: 'Instalação de origem',
        },
        src_concession_text: {
            label: 'Concessão de origem',
        },
        dst_instalation_text: {
            label: 'Instalação de destino'
        },
        dst_concession_text: {
            label: 'Concessão de destino'
        },
        src_instalation: {
            label: 'Instalação de origem',
            isProjectList: true
        },
        src_concession: {
            label: 'Concessão de origem',
            isProjectList: true
        },
        dst_instalation: {
            label: 'Instalação de destino',
            isProjectList: true
        },
        dst_concession: {
            label: 'Concessão de destino',
            isProjectList: true
        },
    },
    labelField: "name",
    gridFields: ["name", "state", 'classification', 'extension'],
    tableLabel: "Gasodutos",
    hasMap: false
}

export = GasPipeline;