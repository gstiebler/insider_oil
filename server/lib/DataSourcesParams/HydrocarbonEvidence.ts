import { IBaseDataSourceParams } from '../../../common/Interfaces';

const HydrocarbonEvidence: IBaseDataSourceParams = {
    fields: {
        well_id: {
            label: 'Poço'
        },
        well_name: {
            label: 'Poço'
        },
        notification_date: {
            label: 'Notificação de Indícios de Hidrocarbonetos'
        },
        fluids: {
            label: 'Fluidos'
        },
        depth: {
            label: "Lâmina d'água"
        },
    },
    labelField: 'well_name',
    gridFields: ['well_name', 'notification_date', 'fluids', 'depth'],
    tableLabel: 'Indicíos de hidrocarbonetos constatados',
    labelSingular: 'Indício de hidrocarboneto',
}

export = HydrocarbonEvidence;