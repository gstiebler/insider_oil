import { IBaseDataSourceParams } from '../../../common/Interfaces';

const Basin: IBaseDataSourceParams = {
    fields: {
        name: {
            label: 'Nome'
        }
    },
    labelField: 'name',
    gridFields: ['name'],
    tableLabel: 'Bacias',
    labelSingular: '',
    hasMap: false
}

export = Basin;