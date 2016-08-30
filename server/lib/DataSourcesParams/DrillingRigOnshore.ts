import { IBaseDataSourceParams } from '../../../common/Interfaces';

const DrillingRigOnshore: IBaseDataSourceParams = {
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
        operator_name: {
            label: "Operador"
        },
        operator_id: {
            label: "Operador"
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
            label: "Day rate (US$)",
            isCurrency: true
        },
        photo: {
            label: 'Foto',
            isPhoto: true
        },
        coords_admin: {
            label: 'Coordenadas (admin)'
        },
    },
    labelField: "name",
    gridFields: ["name", "contractor_name", "type", "end"],
    tableLabel: "Sondas onshore",
    labelSingular: 'Sonda onshore',
    excelParams: {
        keyField: "sonda",
        fields: {
            tipo: 'type',
            sonda: 'name',
            contratante: 'contractor',
            operador: 'operator',
            status: 'status',
            início: 'start',
            fim: 'end',
            'day rate': 'day_rate',
        }
    },
    referencedObjectsOnView:  [
        {
            queryName: 'wellsByDrillingRigOnshore',
            title: 'Poços'
        },
    ]
}

export = DrillingRigOnshore;