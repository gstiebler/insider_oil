import BaseDataSourceParams = require('./BaseDataSourceParams');

const Terminal: BaseDataSourceParams = {
    fields: {
        name: {
            label: 'Nome'
        },
        address: {
            label: 'Endereço'
        },
        type: {
            label: "Terrestre/Marítimo"
        },
        info: {
            label: "Informações"
        },
    },
    labelField: 'name',
    gridFields: ['name', 'type'],
    tableLabel: 'Terminais',
    hasMap: false
}

export = Terminal;