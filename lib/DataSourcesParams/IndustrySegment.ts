import BaseDataSourceParams = require('./BaseDataSourceParams');

const IndustrySegment: BaseDataSourceParams = {
    fields: {
        name: {
            label: 'Nome'
        },
    },
    labelField: 'name',
    gridFields: ['name'],
    tableLabel: 'Segmentos',
    hasMap: false,
}

export = IndustrySegment;