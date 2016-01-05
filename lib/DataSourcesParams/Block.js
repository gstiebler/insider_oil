exports.Block = {
    fields: {
        name: {
            label: 'Nome'
        },
        basin: {
            label: 'Bacia'
        },
        name_contract: {
            label: 'Nome fantasia contrato'
        },
        bid: {
            label: 'BID'
        },
        operator: {
            label: 'Operador'
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
    gridFields: ['name'],
    tableLabel: 'Blocos',
    hasMap: false
}