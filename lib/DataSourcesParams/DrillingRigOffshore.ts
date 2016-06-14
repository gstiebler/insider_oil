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
        operator_name: {
            label: "Operador"
        },
        operator_id: {
            label: "Operador"
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
        },
        day_rate: {
            label: "Day rate (US$)",
            isCurrency: true
        },
        photo: {
            label: 'Foto',
            isPhoto: true
        },
        info: {
            label: "Informações",
            isMultiFieldText: true
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