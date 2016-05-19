import db = require('../../db/models');
import BaseDataSourceParams = require('./BaseDataSourceParams');

const GasMovement: BaseDataSourceParams = {
    fields: {
        product: {
            label: "Produto"
        },
        period_year: {
            label: "Ano"
        },
        period_month: {
            label: "Mês"
        },
        value: {
            label: 'Valor'
        },
        gas_pipeline_id: {
            label: 'Gasoduto',
        },
        gas_pipeline_name: {
            label: 'Gasoduto',
        },
    },
    labelField: "name",
    gridFields: ['gas_pipeline_name', "product", "period_year", 'period_month', 'value'],
    tableLabel: "Gasodutos",
    hasMap: false
}

export = GasMovement;