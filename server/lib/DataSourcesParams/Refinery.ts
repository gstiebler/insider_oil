import { IBaseDataSourceParams } from '../../../common/Interfaces';

const Refinery: IBaseDataSourceParams = {
    fields: {
        name: {
            label: 'Nome'
        },
        address: {
            label: 'Endereço'
        },
        telephones: {
            label: 'Telefone',
            isList: true  
        },
        capacity: {
            label: 'Capacidade'
        },
        info: {
            label: "Informações"
        },
    },
    labelField: 'name',
    gridFields: ['name', 'capacity'],
    tableLabel: 'Refinarias',
    hasMap: false
}

export = Refinery;