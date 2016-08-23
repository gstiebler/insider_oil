import { IBaseDataSourceParams } from '../../../common/Interfaces';

const Contract: IBaseDataSourceParams = {
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
        projects: {
            label: 'Objeto',
            isProjectList: true
        },
    },
    labelField: "user_uid",
    gridFields: ['user_uid', "contract_object", "supplier", 'value', 'start', 'end', 'situation'],
    tableLabel: "Contratos",
    labelSingular: 'Contrato',
    hasMap: false,
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
        }
    },
}

export = Contract;