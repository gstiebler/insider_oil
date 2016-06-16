import BaseDataSourceParams = require('./BaseDataSourceParams');

// Basin is usually redundant with Block. But it's importante because some
// Oil Fields doesn't have the reference to a Block
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
            label: "Concessionárias (admin)",
            isManyToMany: true,
            comboSource: 'Company'
        },
        concessionaries_props: {
            label: "Concessionárias % (admin)",
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
    ],
    excelParams: {
        keyField: "nome",
        fields: {
            'nome': 'name',
            'bacia': 'basin',
            'bloco': 'block',
            'estado': 'state',
            'concessionárias': 'concessionaries',
            'terra/mar': 'shore',
            'estágio': 'stage',
        }
    },
};

export = OilField;