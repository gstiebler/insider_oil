import { IBaseDataSourceParams } from '../../../common/Interfaces';

const ComercialDeclaration: IBaseDataSourceParams = {
    fields: {
        block_id: {
            label: 'Bloco'
        },
        block_name: {
            label: 'Bloco'
        },
        attached: {
            label: 'Anexado'
        },
        date: {
            label: 'Data'
        },
    },
    labelField: 'block_name',
    gridFields: ['block_name', 'basin_name', 'oil_field_name', 'date'],
    tableLabel: 'Declarações de comercialidade',
    labelSingular: 'Declaração de comercialidade',
}

export = ComercialDeclaration;