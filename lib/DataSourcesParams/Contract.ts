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
        situation: {
            label: 'Situação',
        },
        additives_ids: {
            label: 'Número dos aditivos'
        },
        bid_id: {
            label: 'Licitação'
        },
        model_id: {
            label: 'Objeto'
        },
        obj_id: {
            label: 'Objeto'
        },
        object: {
            label: 'Objeto',
            isProjectList: true
        }
    },
    labelField: "contract_object",
    gridFields: ["contract_object", "supplier", 'value', 'start', 'end', 'situation'],
    tableLabel: "Contratos",
    hasMap: false
}

export = Contract;