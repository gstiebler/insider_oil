import BaseDataSourceParams = require('./BaseDataSourceParams');

const HydrocarbonEvidence: BaseDataSourceParams = {
    fields: {
        name: {
            label: 'Fluidos'
        },
        operator_name: {
            label: "Lâmina d'água"
        },
        oil_field_id: {
            label: 'Campo'
        },
        oil_field_name: {
            label: 'Campo'
        },
        production_unit_id: {
            label: 'Unidade de produção'
        },
        production_unit_name: {
            label: 'Unidade de produção'
        },
    },
    labelField: 'name',
    gridFields: ['name', 'oil_field_name', 'production_unit_name'],
    tableLabel: 'Poços de produção',
    hasMap: false
}

export = HydrocarbonEvidence;