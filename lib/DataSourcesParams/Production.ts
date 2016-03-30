import BaseDataSourceParams = require('./BaseDataSourceParams');

const Production: BaseDataSourceParams = {
    fields: {
        state: {
            label: 'Estado'
        },
        basin_id: {
            label: 'Bacia'
        },
        basin_name: {
            label: 'Bacia'
        },
        well_anp: {
            label: 'Nome poço ANP'
        },
        well_operator: {
            label: 'Nome poço operador'
        },
        oil_field_id: {
            label: 'Campo'
        },
        oil_field_name: {
            label: 'Campo'
        },
        operator_id: {
            label: 'Operador'
        },
        operator_name: {
            label: 'Operador'
        },
        contract: {
            label: 'Número do Contrato'
        },
        period: {
            label: 'Período'
        },
        oil_production: {
            label: 'Óleo (bbl/dia)'
        },
        oil_condensed_production: {
            label: 'Condensado (bbl/dia)'
        },
        gas_associated_production: {
            label: 'Gás natural associado'
        },
        gas_non_associated_production: {
            label: 'Gás natural não associado'
        },
        gas_royaties_volume: {
            label: 'Volume Gás Royalties (Mm³/dia)'
        },
        water_production: {
            label: 'Água (bbl/dia)'
        },
        instalation: {
            label: 'Instalação Destino'
        },
        instalation_type: {
            label: 'Tipo Instalação'
        },
        production_time: {
            label: 'Tempo de Produção (hs por mês)'
        }
    },
    labelField: 'well_operator',
    gridFields: ['basin_name', 'well_operator', 'oil_production', 'gas_associated_production'],
    tableLabel: 'Produção',
    hasMap: false
}

export = Production;