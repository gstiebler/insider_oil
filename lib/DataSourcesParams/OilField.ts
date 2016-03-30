import BaseDataSourceParams = require('./BaseDataSourceParams');

const OilField: BaseDataSourceParams = {
    fields: {
        name: {
            label: "Nome"
        },
        basin_id: {
            label: "Bacia"
        },
        basin_name: {
            label: "Bacia"
        },
        state: {
            label: "Estado"
        },
        concessionaries: {
            label: "Concessionárias"
        },
        userShore: {
            label: "Terra/Mar"
        }
    },
    labelField: "name",
    gridFields: ['name', 'basin_name', 'state', 'concessionaries', 'userShore'],
    tableLabel: "Campos",
    hasMap: false
};

export = OilField;