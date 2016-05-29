import db = require('../../db/models');
import BaseDataSourceParams = require('./BaseDataSourceParams');

const Contract: BaseDataSourceParams = {
    fields: {
        supplier: {
            label: "Fornecedor"
        },
        supplier_identifier: {
            label: "CNPJ/CPF"
        },
        contract_object: {
            label: "Objeto da contratação"
        },
        start: {
            label: 'Início da vigência'
        },
        end: {
            label: 'Fim da vigência',
        },
        value: {
            label: 'Valor do contrato',
        },
        contractor_name: {
            label: 'Contratante'
        },
        contractor_id: {
            label: 'Contratante'
        },
        situation: {
            label: 'Situação',
        },
        additives_ids: {
            label: 'Número dos aditivos'
        },
        bid_id: {
            label: 'Licitação'
        },
        object: {
            label: 'Objeto',
            isProjectList: true
        },
        model_id: {
            label: 'ignorar'
        },
        obj_id: {
            label: 'ignorar'
        },
    },
    labelField: "contract_object",
    gridFields: ["contract_object", "supplier", 'value', 'start', 'end', 'situation'],
    tableLabel: "Contratos",
    hasMap: false
}

export = Contract;