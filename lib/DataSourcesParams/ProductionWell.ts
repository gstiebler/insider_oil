import BaseDataSourceParams = require('./BaseDataSourceParams');

const ProductionWell: BaseDataSourceParams = {
    fields: {
        name: {
            label: 'Nome'
        },
        name_operator: {
            label: "Nome operador"
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
    hasMap: false,
    excelParams: {
        keyField: "anp",
        fields: {
            'anp': 'name',
            'nome operador': 'name_operator',
            'campo': 'oil_field',
            'unidade de produção': 'production_unit'
        }
    },
}

export = ProductionWell;