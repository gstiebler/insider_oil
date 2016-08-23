import { IBaseDataSourceParams } from '../../../common/Interfaces';

const Reserve: IBaseDataSourceParams = {
    fields: {
        state: {
            label: 'Estado'
        },
        reserve: {
            label: 'Reservas (milhões m3)'
        },
        year: {
            label: "Ano"
        },
        shore: {
            label: "Terra/Mar"
        }
    },
    labelField: 'state',
    gridFields: ['state', 'reserve', 'year', 'shore'],
    tableLabel: 'Reservas',
    labelSingular: 'Reserva',
    hasMap: false
}

export = Reserve;