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
        start: {
            label: "Início"
        },
        end: {
            label: "Fim"
        },
        status: {
            label: "Status"
        },
        day_rate: {
            label: "Day rate"
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