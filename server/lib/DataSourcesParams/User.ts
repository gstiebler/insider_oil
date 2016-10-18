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
        active: {
            label: 'Ativo',
        },
        paying: {
            label: 'Pagante',
        },
    },
    labelField: 'name',
    gridFields: ['name'],
    tableLabel: 'Usuários',
    labelSingular: 'Usuário',
}

export = User;