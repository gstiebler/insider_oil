import BaseDataSourceParams = require('./BaseDataSourceParams');

const DrillingRigOnshore: BaseDataSourceParams = {
    fields: {
        name: {
            label: "Sonda Onshore"
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
    tableLabel: "Sondas onshore",
    hasMap: false,
    excelParams: {
        keyField: "sonda",
        fields: {
            tipo: 'type',
            sonda: 'name',
            empresa: 'contractor',
            vencimento: 'end',
        }
    }
}

export = DrillingRigOnshore;