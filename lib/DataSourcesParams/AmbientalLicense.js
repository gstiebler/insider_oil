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
        keyField: 'nº da licença',
        fields: {
            'emissão': 'start',
            'vencimento': 'end',
            'nº da licença': 'license',
            'empreendimento': 'enterprise',
            'empreendedor': 'entrepreneur',
            'nº do processo': 'process',
            'tipologia': 'tipology',
            'pac': 'pac'
        }
    }
}