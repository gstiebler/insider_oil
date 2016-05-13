import BaseDataSourceParams = require('./BaseDataSourceParams');

const Refinery: BaseDataSourceParams = {
    fields: {
        name: {
            label: 'Poço'
        },
        address: {
            label: 'Poço'
        },
        telephones: {
            label: 'Telefone',
            isList: true  
        },
        capacity: {
            label: 'Capacidade'
        },
        info: {
            label: "Informações"
        },
    },
    labelField: 'name',
    gridFields: ['well_name', 'capacity'],
    tableLabel: 'Refinarias',
    hasMap: false
}

export = Refinery;