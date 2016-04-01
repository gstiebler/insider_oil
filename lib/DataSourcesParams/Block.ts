import BaseDataSourceParams = require('./BaseDataSourceParams');

const Block: BaseDataSourceParams = {
    fields: {
        name: {
            label: 'Nome'
        },
        basin_id: {
            label: 'Bacia'
        },
        basin_name: {
            label: 'Bacia'
        },
        name_contract: {
            label: 'Nome fantasia contrato'
        },
        bid: {
            label: 'BID'
        },
        operator_name: {
            label: "Operador"
        },
        operator_id: {
            label: "Operador"
        },
        end_1: {
            label: '1P Vencimento'
        },
        end_2: {
            label: '2P Vencimento'
        },
        end_3: {
            label: '3P Vencimento'
        },
        end_last: {
            label: 'Vencimento último PAD'
        },
        status: {
            label: 'Status'
        },
        concessionaries: {
            label: 'Concessionários'
        }
    },
    labelField: 'name',
    gridFields: ['name', 'operator_name'],
    tableLabel: 'Blocos',
    hasMap: false,
    urlSource: 'http://www.anp.gov.br/SITE/acao/download/?id=57558',
    excelParams: {
        keyField: "bloco",
        fields: {
            bacia: 'basin',
            bloco: 'name',
            'nome fantasia contrato': 'name_contract',
            bid: 'bid',
            operador: 'operator',
            '1p vencimento': 'end_1',
            '2p vencimento': 'end_2',
            '3p vencimento': 'end_3',
            'vencimento último pad': 'end_last',
            status: 'status',
            'concessionários': 'concessionaries'
        }
    },
    referencedObjectsOnView:  [
        {
            dataSource: 'Well',
            filterField: 'block_id',
            showFields: [
                'name',
                'operator_name'
            ]
        },
        {
            dataSource: 'ComercialDeclaration',
            filterField: 'block_id',
            showFields: [
                'attached',
                'date'
            ]
        },
        {
            dataSource: 'AmbientalLicense',
            filterField: 'block_id',
            queryName: 'byBlock',
            showFields: [
                'license',
                'start',
                'end',
                'enterprise',
                'entrepreneur'
            ]
        }
    ]
}

export = Block;