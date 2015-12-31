exports.DrillingRigOffshore = {
    fields: {
        name: {
            label: "Sonda Offshore"
        },
        contractor_name: {
            label: "Contratante"
        },
        contractor_id: {
            label: "Contratante"
        },
        type: {
            label: "Tipo"
        },
        end: {
            label: "Fim"
        }
    },
    labelField: "name",
    gridFields: ["name", "contractor_name", "type", "end"],
    tableLabel: "Sondas offshore",
    hasMap: false,
    excelParams: {
        keyField: "sonda",
        fields: {
            tipo: 'type',
            sonda: 'name',
            contratada: 'contractor',
            vencimento: 'end',
        }
    }
}