import BaseDataSourceParams = require('./BaseDataSourceParams');

const ProductionUnit: BaseDataSourceParams = {
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
        type: {
            label: 'Tipo'
        },
        owner: {
            label: 'Empresa proprietária'
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
    },
    labelField: 'name',
    gridFields: ['name', 'oil_field_name', 'owner'],
    tableLabel: 'Unidades de produção',
    hasMap: false
}

export = ProductionUnit;