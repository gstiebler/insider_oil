exports.OilField = { 
    fields: {
        name: {
            label: "Nome"
        },
        basin: {
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
    gridFields: ['name', 'basin', 'state', 'concessionaries', 'userShore'],
    tableLabel: "Campos",
    hasMap: false
};