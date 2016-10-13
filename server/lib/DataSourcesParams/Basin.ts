import { IBaseDataSourceParams } from '../../../common/Interfaces';

const Basin: IBaseDataSourceParams = {
    fields: {
        name: {
            label: 'Nome'
        }
    },
    referencedObjectsOnView:  [
        {
            queryName: 'oilFieldsByBasin',
            title: 'Campos'
        },
        {
            queryName: 'blocksByBasin',
            title: 'Blocos'
        },
    ],
    labelField: 'name',
    gridFields: ['name'],
    tableLabel: 'Bacias',
    labelSingular: 'Bacia',
}

export = Basin;