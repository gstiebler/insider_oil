import { IBaseDataSourceParams } from '../../../common/Interfaces';

const Bid: IBaseDataSourceParams = {
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
        segment_name: {
            label: 'Segmento'
        },
        segment_id: {
            label: 'Segmento'
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
    labelSingular: 'Licitação',
    excelParams: {
        keyField: 'processo',
        fields: {
            'processo': 'process_number',
            'modalidade': 'modality',
            'objeto do contrato': 'contract_object',
            'quantidade de itens': 'qty_items',
            'data de abertura': 'opening_moment',
            'local de abertura': 'opening_local',
            'cidade de abertura': 'opening_city',
            'estado': 'opening_state',
            'segmento': 'segment',
            'situação': 'situation',
            'contratante': 'contractor',
        }
    },
}

export = Bid;