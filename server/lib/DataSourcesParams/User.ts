import { IBaseDataSourceParams } from '../../../common/Interfaces';

const User: IBaseDataSourceParams = {
    fields: {
        login: {
            label: 'Login'
        },
        name: {
            label: 'Nome'
        },
        email: {
            label: 'E-mail'
        },
        password: {
            label: 'Senha'
        },
        admin: {
            label: 'Administrador',
        },
    },
    labelField: 'name',
    gridFields: ['name'],
    tableLabel: 'Usuários',
    hasMap: false,
}

export = User;