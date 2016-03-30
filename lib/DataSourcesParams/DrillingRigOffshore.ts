import BaseDataSourceParams = require('./BaseDataSourceParams');

const DrillingRigOffshore: BaseDataSourceParams = {
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
        status: {
            label: "Status"
        },
        lda: {
            label: "LDA"
        },
        start: {
            label: "Início"
        },
        end: {
            label: "Fim"
        }
    },
    labelField: "name",
    gridFields: ["name", "contractor_name", "type", "status", "lda", "start", "end"],
    tableLabel: "Sondas offshore",
    hasMap: false,
    excelParams: {
        keyField: "sonda",
        fields: {
            tipo: 'type',
            sonda: 'name',
            contratada: 'contractor',
            status: 'status',
            lda: 'lda',
            início: 'start',
            fim: 'end',
        }
    }
}

export = DrillingRigOffshore