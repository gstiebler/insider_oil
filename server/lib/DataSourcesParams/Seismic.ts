import { IBaseDataSourceParams } from '../../../common/Interfaces';

const Seismic: IBaseDataSourceParams = {
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
        block_id: {
            label: "Bloco"
        },
        block_name: {
            label: "Bloco"
        }
    },
    labelField: "process",
    gridFields: ["process", "authorized_company", "dou_publi_date", "end_date", "authorized_technologies", "block_name"],
    tableLabel: "Sísmicas",
    hasMap: false,
    excelParams: {
        keyField: 'processo',
        fields: {
            'processo': 'process',
            'empresa autorizada': 'authorized_company',
            'publicação no dou': 'dou_publi_date',
            'validade': 'end_date',
            'tecnologias autorizadas': 'authorized_technologies',
            'bloco': 'block'
        }
    }
}

export = Seismic