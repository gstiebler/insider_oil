import { IBaseDataSourceParams } from '../../../common/Interfaces';

const Contract: IBaseDataSourceParams = {
    fields: {
        user_uid: {
            label: 'Id interno (admin)'
        },
        supplier_identifier: {
            label: "CNPJ/CPF"
        },
        supplier: {
            label: "Fornecedor texto (admin)"
        },
        supplier_obj_id: {
            label: "Fornecedor referência (admin)"
        },
        supplier_formatted: {
            label: "Fornecedor"
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
        currency: {
            label: 'Moeda',
        },
        show_day_rate: {
            label: 'Mostrar day rate (admin)',
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
        duration: {
            label: 'Duração (dias)'
        },
        type: {
            label: 'Tipo'
        },
        projects: {
            label: 'Objeto',
            isProjectList: true
        },
    },
    labelField: "user_uid",
    gridFields: ['user_uid', "contract_object", "supplier", 'value', 'start', 'end', 'situation'],
    tableLabel: "Contratos",
    labelSingular: 'Contrato',
    excelParams: {
        keyField: 'identificador',
        fields: {
            'identificador': 'user_uid',
            'fornecedor': 'supplier',
            'cnpj/cpf': 'supplier_identifier',
            'objeto da contratação': 'contract_object',
            'início da vigência': 'start',
            'fim da vigência': 'end',
            'valor do contrato': 'value',
            'moeda': 'currency',
            'contratante': 'contractor',
            'segmento': 'segment',
            'situação': 'situation',
            'número dos aditivos': 'additives_ids',
            'licitação': 'bid',
            'Tipo': 'type',
        }
    },
}

export = Contract;