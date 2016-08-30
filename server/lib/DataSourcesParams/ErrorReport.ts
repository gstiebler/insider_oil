import { IBaseDataSourceParams } from '../../../common/Interfaces';

const Contract: IBaseDataSourceParams = {
    fields: {
        url: {
            label: 'URL'
        },
        reporter_id: {
            label: "Reportado por"
        },
        reporter_name: {
            label: "Reportado por"
        },
        responsible_name: {
            label: "Responsável"
        },
        responsible_id: {
            label: 'Responsável'
        },
        description: {
            label: 'Descrição',
        },
        status: {
            label: 'Status',
        },
        created_at: {
            label: 'Reportado em',
        },
    },
    labelField: "user_uid",
    gridFields: ['url', 'reporter_name', 'status', 'responsible_name', 'created_at'],
    tableLabel: "Reports de erro",
    labelSingular: 'Report de erro',
}

export = Contract;