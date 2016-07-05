import { IBaseDataSourceParams } from '../../../common/Interfaces';

const Fleet: IBaseDataSourceParams = {
    fields: {
        name: {
            label: 'Nome'
        },
        year: {
            label: 'Ano de construção'
        },
        country: {
            label: "País de origem"
        },
        type: {
            label: "Tipo"
        },
        weight: {
            label: "Porte Bruto (DWT)"
        },
    },
    labelField: 'name',
    gridFields: ['name', 'year', 'country', 'type', 'weight'],
    tableLabel: 'Frota Transpetro',
    hasMap: false
}

export = Fleet;