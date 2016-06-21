import db = require('../../db/models');
import BaseDataSourceParams = require('./BaseDataSourceParams');

const Bid: BaseDataSourceParams = {
    fields: {
        period: {
            label: "Data"
        },
        production_unit_name: {
            label: 'Unidade de produção'
        },
        production_unit_id: {
            label: 'Unidade de produção'
        },
    },
    labelField: "period",
    gridFields: ["period", "production_unit_name"],
    tableLabel: "Datas de manutenção",
    hasMap: false,
}

export = Bid;