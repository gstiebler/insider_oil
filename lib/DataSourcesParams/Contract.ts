import db = require('../../db/models');
import BaseDataSourceParams = require('./BaseDataSourceParams');

const Contract: BaseDataSourceParams = {
    fields: {
        user_uid: {
            label: 'Id interno (admin)'
        },
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
            isCurrency: true
        },
        contractor_name: {
            label: 'Contratante'
        },
        contractor_id: {
            label: 'Contratante'
        },
        segment_name: {
            label: 'Segmento'
        },
        segment_id: {
            label: 'Segmento'
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
    hasMap: false,
    excelParams: {
        keyField: 'user_uid',
        fields: {
            'Fornecedor': 'supplier',
            'CNPJ/CPF': 'supplier_identifier',
            'Objeto da contratação': 'contract_object',
            'Início da vigência': 'start',
            'Fim da vigência': 'end',
            'Valor do contrato': 'value',
            'Contratante': 'contractor',
            'Segmento': 'segment',
            'Situação': 'situation',
            'Número dos aditivos': 'additives_ids',
            'Licitação': 'bid',
        }
    },
}

export = Contract;