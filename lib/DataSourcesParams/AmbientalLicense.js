exports.AmbientalLicense = {
    fields: {
        license: {
            label: 'Nro da licença'
        },
        start: {
            label: 'Emissão'
        },
        end: {
            label: 'Vencimento'
        },
        enterprise: {
            label: 'Empreendimento'
        },
        entrepreneur: {
            label: 'Empreendedor'
        },
        process: {
            label: 'Nro do processo'
        },
        tipology: {
            label: 'Tipologia'
        },
        pac: {
            label: 'PAC'
        }
    },
    labelField: 'license',
    gridFields: ['license', 'start', 'end', 'enterprise', 'entrepreneur', 'process', 'tipology', 'pac'],
    tableLabel: 'Licenças ambientais',
    hasMap: false,
    excelParams: {
        keyField: 'Nº da Licença',
        fields: {
            'emissão': 'start',
            'vencimento': 'end',
            'estado': 'state',
            'Nº da Licença': 'license',
            'empreendimento': 'enterprise',
            'empreendedor': 'entrepreneur',
            'Nº do Processo': 'lng',
            'tipologia': 'tipology',
            'pac': 'pac'
        }
    }
}