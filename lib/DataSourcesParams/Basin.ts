import BaseDataSourceParams = require('./BaseDataSourceParams');

const Basin: BaseDataSourceParams = {
    fields: {
        name: {
            label: 'Nome'
        }
    },
    labelField: 'name',
    gridFields: ['name'],
    tableLabel: 'Bacias',
    hasMap: false
}

export = Basin;