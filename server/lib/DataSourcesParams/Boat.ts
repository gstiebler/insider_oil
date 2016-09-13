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
    excelParams: {
        keyField: 'nome',
        fields: {
            'nome': 'name',
            'tipo de embarcação': 'type',
            'empresa proprietária': 'owner',
            'empresa operadora': 'operator',
            'Inscrição': 'Inscrição',
            'IMO': 'IMO',
            'REB': 'REB',
            'TEU': 'TEU',
            'Capacidade de passageiros': 'Capacidade de passageiros',
            'BHP': 'BHP',
            'Arqueação bruta': 'Arqueação bruta',
            'Comprimento': 'Comprimento',
            'Calado': 'Calado',
            'IRIN': 'IRIN',
            'Registro no tribunal marítimo': 'Registro no tribunal marítimo',
            'Tipo de navegação': 'Tipo de navegação',
            'TPB': 'TPB',
            'Ano de construção': 'Ano de construção',
            'Qtde motores': 'Qtde motores',
            'Situação': 'Situação',
            'Arqueação líquida': 'Arqueação líquida',
            'Boca': 'Boca',
            'Natureza ou Tipo de Carga': 'Natureza ou Tipo de Carga',
        }
    }
}

export = Boat;