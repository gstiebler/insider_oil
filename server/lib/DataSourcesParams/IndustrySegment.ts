import { IBaseDataSourceParams } from '../../../common/Interfaces';

const IndustrySegment: IBaseDataSourceParams = {
    fields: {
        name: {
            label: 'Nome'
        },
    },
    labelField: 'name',
    gridFields: ['name'],
    tableLabel: 'Segmentos',
    labelSingular: 'Segmento',
}

export = IndustrySegment;