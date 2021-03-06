import { IBaseDataSourceParams } from '../../../common/Interfaces';

const ProductionUnit: IBaseDataSourceParams = {
    fields: {
        name: {
            label: 'Nome'
        },
        oil_field_id: {
            label: 'Campo'
        },
        oil_field_name: {
            label: 'Campo'
        },
        block_id: {
            label: 'Bloco'
        },
        block_name: {
            label: 'Bloco'
        },
        type: {
            label: 'Tipo'
        },
        status: {
            label: 'Status'
        },
        coords_admin: {
            label: 'Coordenadas (admin)'
        },
        general_info: {
            label: 'Informações'
        },
        owner_id: {
            label: 'Empresa proprietária'
        },
        owner_name: {
            label: 'Empresa proprietária'
        },
        operator_id: {
            label: 'Empresa operadora'
        },
        operator_name: {
            label: 'Empresa operadora'
        },
        situation: {
            label: 'Situação'
        },
        oil_processing_capacity: {
            label: 'Capacidade de processamento de óleo (mbpd)'
        },
        gas_processing_capacity: {
            label: 'Capacidade de processamento de gás (mm m3/d)'
        },
        oil_storage_capacity: {
            label: 'Capacidade de estocagem de óleo (mbbl)'
        },
        start: {
            label: 'Início do contrato'
        },
        end: {
            label: 'Término do contrato'
        },
        depth: {
            label: "Lâmina d'água"
        },
        first_oil: {
            label: 'Início da produção'
        },
        day_rate: {
            label: "Day rate (US$)",
            isCurrency: true
        },
        photo: {
            label: 'Foto',
            isPhoto: true
        },
    },
    labelField: 'name',
    gridFields: ['name', 'oil_field_name', 'block_name', 'status'],
    tableLabel: 'Unidades de produção',
    labelSingular: 'Unidade de produção',
    excelParams: {
        keyField: "nome",
        fields: {
            'nome': 'name',
            'campo': 'oil_field',
            'bloco': 'block',
            'tipo': 'type',
            'empresa proprietária': 'owner',
            'situação': 'situation',
            'capacidade de processamento de óleo': 'oil_processing_capacity',
            'capacidade de processamento de gás': 'gas_processing_capacity',
            'capacidade de estocagem de óleo': 'oil_storage_capacity',
            'início do contrato': 'start',
            'término do contrato': 'end',
            "lâmina d'água": 'depth',
            'início da produção': 'first_oil',
            'day rate': 'day_rate',
        }
    },
    referencedObjectsOnView:  [
        {
            queryName: 'maintenanceDatesByProductionUnit',
            title: 'Datas de manutenção'
        },
    ]
}

export = ProductionUnit;