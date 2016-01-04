exports.FPSOProduction = {
    fields: {
        name: {
            label: 'Nome da unidade'
        },
        owner: {
            label: 'Empresa propriet�ria'
        },
        status: {
            label: 'Situa��o'
        },
        field: {
            label: 'Campo/Ativo'
        },
        oil_processing_capacity: {
            label: 'Capacidade de processamento de �leo (mbpd)'
        },
        gas_processing_capacity: {
            label: 'Capacidade de processamento de g�s (mm m3/d)'
        },
        oil_storage_capacity: {
            label: 'Capacidade de estocagem de �leo (mbbl)'
        },
        depth: {
            label: 'L�mina d��gua (m)'
        },
        start: {
            label: 'In�cio do contrato'
        },
        end: {
            label: 'T�rmino do contrato'
        },
        operating_wells: {
            label: 'Po�os produtores em opera��o'
        },
        injecting_wells: {
            label: 'Po�os injetores em opera��o'
        }
    },
    labelField: 'name',
    gridFields: ['name', 'owner', 'status', 'field', 'start', 'end'],
    tableLabel: 'Produ��o FPSOs',
    hasMap: false
}