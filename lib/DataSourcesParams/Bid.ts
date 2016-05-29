import db = require('../../db/models');
import BaseDataSourceParams = require('./BaseDataSourceParams');

const Bid: BaseDataSourceParams = {
    fields: {
        process_number: {
            label: "Número do processo"
        },
        modality: {
            label: "Modalidade da licitação"
        },
        contract_object: {
            label: "Objeto da contratação"
        },
        qty_items: {
            label: 'Quantidade de itens'
        },
        opening_moment: {
            label: 'Data de abertura',
        },
        opening_local: {
            label: 'Local de abertura',
        },
        opening_city: {
            label: 'Cidade de abertura',
        },
        opening_state: {
            label: 'Estado'
        },
        situation: {
            label: 'Situação'
        },
        contractor_name: {
            label: 'Contratante'
        },
        contractor_id: {
            label: 'Contratante'
        },
        model_id: {
            label: 'ignorar'
        },
        obj_id: {
            label: 'ignorar'
        },
        object: {
            label: 'Objeto',
            isProjectList: true
        }
    },
    labelField: "process_number",
    gridFields: ["process_number", "modality", 'contract_object'],
    tableLabel: "Licitações",
    hasMap: false
}

export = Bid;