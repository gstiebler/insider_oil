exports.ComercialDeclaration = {
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
    },
    labelField: 'block_name',
    gridFields: ['block_name', 'basin_name', 'oil_field_name', ''],
    tableLabel: 'Declarações de comercialidade',
    hasMap: false
}