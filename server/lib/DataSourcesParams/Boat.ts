import { IBaseDataSourceParams } from '../../../common/Interfaces';

const Boat: IBaseDataSourceParams = {
    fields: {
        name: {
            label: 'Nome'
        },
        type: {
            label: 'Tipo'
        },
        owner_id: {
            label: 'Empresa proprietária'
        },
        owner_name: {
            label: 'Empresa proprietária'
        },
        operator_id: {
            label: 'Operador'
        },
        operator_name: {
            label: 'Operador'
        },
    },
    labelField: 'name',
    gridFields: ['name', 'type', 'owner_name', 'operator_name'],
    tableLabel: 'Barcos de apoio',
    labelSingular: 'Barco de apoio',
}

export = Boat;