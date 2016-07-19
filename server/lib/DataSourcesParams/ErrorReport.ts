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
    },
    labelField: "user_uid",
    gridFields: ['url', 'reporter_name', 'status', 'resonsible_name', 'created_at'],
    tableLabel: "Reports de erro",
    hasMap: false,
}

export = Contract;