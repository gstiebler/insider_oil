import { IBaseDataSourceParams } from '../../../common/Interfaces';

const AmbientalLicense: IBaseDataSourceParams = {
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
        },
        blocks: {
            label: 'Blocos',
            isManyToMany: true,
            comboSource: 'Block'
        },
    },
    labelField: 'license',
    gridFields: ['license', 'start', 'end', 'enterprise', 'entrepreneur', 'process', 'tipology', 'pac'],
    tableLabel: 'Licenças ambientais',
    labelSingular: 'Licença ambiental',
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

export = AmbientalLicense;