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
            label: "Concessionárias",
            isManyToMany: true,
            comboSource: 'Company'
        },
        concessionaries_props: {
            label: "Concessionárias %",
            isList: true
        },
        formatted_concessionaries: {
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
        block_name: {
            label: "Bloco"
        },
        block_id: {
            label: "Bloco"
        },
    },
    labelField: "name",
    gridFields: ['name', 'basin_name', 'state', 'shore', 'stage'],
    tableLabel: "Campos",
    hasMap: false,
    referencedObjectsOnView:  [
        {
            queryName: 'hydrocarbonEvidencesByOilField',
            title: 'Indícios de hidrocarbonetos'
        }
    ]
};

export = OilField;