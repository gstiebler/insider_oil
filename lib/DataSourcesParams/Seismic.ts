import BaseDataSourceParams = require('./BaseDataSourceParams');

const Seismic: BaseDataSourceParams = {
    fields: {
        process: {
            label: "Processo"
        },
        authorized_company: {
            label: "Empresa autorizada"
        },
        dou_publi_date: {
            label: "Publicação no DOU"
        },
        end_date: {
            label: "Validade"
        },
        authorized_technologies: {
            label: "Tecnologias autorizadas"
        },
        basin_id: {
            label: "Bacia sedimentar"
        },
        basin_name: {
            label: "Bacia sedimentar"
        }
    },
    labelField: "process",
    gridFields: ["process", "authorized_company", "dou_publi_date", "end_date", "authorized_technologies", "basin_name"],
    tableLabel: "Sísmicas",
    hasMap: false,
    excelParams: {
        keyField: 'processo',
        fields: {
            'processo': 'process',
            'Empresa Autorizada': 'authorized_company',
            'Publicação no DOU': 'dou_publi_date',
            'Validade': 'end_date',
            'Tecnologias Autorizadas': 'authorized_technologies',
            'Bacia Sedimentar': 'basin'
        }
    }
}

export = Seismic