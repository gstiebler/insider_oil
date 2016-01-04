exports.FixedUEPProduction = {
    fields: {
        name: {
            label: 'Nome'
        },
        code: {
            label: 'Sigla'
        },
        basin: {
            label: 'Bacia'
        },
        operator: {
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