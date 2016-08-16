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
		// this field do not exists on DB. It's only here to 
		// facilitate photo upload
        photo: {
            label: 'Foto',
            isPhoto: true
        },
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