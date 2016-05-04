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
        },
        shore: {
            label: "Terra/Mar"
        },
        stage: {
            label: "Estágio"
        },
    },
    labelField: "name",
    gridFields: ['name', 'basin_name', 'state', 'concessionaries', 'shore', 'stage'],
    tableLabel: "Campos",
    hasMap: false
};

export = OilField;