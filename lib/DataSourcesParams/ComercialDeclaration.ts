import BaseDataSourceParams = require('./BaseDataSourceParams');

const ComercialDeclaration: BaseDataSourceParams = {
    fields: {
        block_id: {
            label: 'Bloco'
        },
        block_name: {
            label: 'Bloco'
        },
        basin_id: {
            label: 'Bacia'
        },
        basin_name: {
            label: 'Bacia'
        },
        oil_field_id: {
            label: 'Campo'
        },
        oil_field_name: {
            label: 'Campo'
        },
        attached: {
            label: 'Anexado'
        },
        date: {
            label: 'Data'
        },
    },
    labelField: 'block_name',
    gridFields: ['block_name', 'basin_name', 'oil_field_name', 'date'],
    tableLabel: 'Declarações de comercialidade',
    hasMap: false
}

export = ComercialDeclaration;