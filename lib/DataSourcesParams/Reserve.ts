import BaseDataSourceParams = require('./BaseDataSourceParams');

const Reserve: BaseDataSourceParams = {
    fields: {
        state: {
            label: 'Estado'
        },
        reserve: {
            label: 'Reservas (milhões m3)'
        },
        year: {
            label: "Ano"
        },
        shore: {
            label: "Terra/Mar"
        }
    },
    labelField: 'state',
    gridFields: ['state', 'reserve', 'year', 'shore'],
    tableLabel: 'Reservas',
    hasMap: false
}

export = Reserve;