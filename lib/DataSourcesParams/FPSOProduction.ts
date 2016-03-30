import BaseDataSourceParams = require('./BaseDataSourceParams');

const FPSOProduction: BaseDataSourceParams = {
    fields: {
        name: {
            label: 'Nome da unidade'
        },
        owner: {
            label: 'Empresa proprietária'
        },
        status: {
            label: 'Situação'
        },
        field_id: {
            label: 'Campo/Ativo'
        },
        field_name: {
            label: 'Campo/Ativo'
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
        depth: {
            label: 'Lâmina d´água (m)'
        },
        start: {
            label: 'Início do contrato'
        },
        end: {
            label: 'Término do contrato'
        },
        operating_wells: {
            label: 'Poços produtores em operação'
        },
        injecting_wells: {
            label: 'Poços injetores em operação'
        }
    },
    labelField: 'name',
    gridFields: ['name', 'owner', 'status', 'field_name', 'start', 'end'],
    tableLabel: 'Produção FPSOs',
    hasMap: false
}

export = FPSOProduction