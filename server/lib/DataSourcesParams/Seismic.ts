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
            'Empresa Autorizada': 'authorized_company',
            'Publicação no DOU': 'dou_publi_date',
            'Validade': 'end_date',
            'Tecnologias Autorizadas': 'authorized_technologies',
            'Bloco': 'block'
        }
    }
}

export = Seismic