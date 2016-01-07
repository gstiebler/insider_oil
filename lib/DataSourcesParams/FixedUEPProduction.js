exports.FixedUEPProduction = {
    fields: {
        name: {
            label: 'Nome'
        },
        code: {
            label: 'Sigla'
        },
        basin_id: {
            label: 'Bacia'
        },
        basin_name: {
            label: 'Bacia'
        },
        operator_id: {
            label: 'Operador'
        },
        operator_name: {
            label: 'Operador'
        },
        lat: {
            label: 'Latitude'
        },
        lng: {
            label: 'Longitude'
        },
        depth: {
            label: 'Lâmina d´água (m)'
        }
    },
    labelField: 'name',
    gridFields: ['name', 'basin', 'operator'],
    tableLabel: 'Produção UEP fixas',
    hasMap: true
}