import { IBaseDataSourceParams } from '../../../common/Interfaces';

const Fleet: IBaseDataSourceParams = {
    fields: {
        user: {
            label: 'Usuário'
        },
        model: {
            label: 'Tabela'
        },
        file_name: {
            label: 'Arquivo'
        },
        status: {
            label: 'Status'
        },
        result: {
            label: 'Conteúdo'
        },
        created_at: {
            label: 'Momento'
        },
    },
    labelField: 'name',
    gridFields: ['created_at', 'user', 'model', 'status'],
    tableLabel: 'Log importação Excel',
    labelSingular: 'Log importação Excel',
}

export = Fleet;