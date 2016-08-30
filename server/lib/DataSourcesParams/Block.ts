import { IBaseDataSourceParams } from '../../../common/Interfaces';

const Block: IBaseDataSourceParams = {
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
        updates: {
            label: "Atualizações"
        },
        polygons_admin: {
            label: "Polígonos (admin)",
            isTextArea: true
        },
        concessionaries: {
            label: "Concessionárias",
            isConcessionaries: true,
            isManyToMany: true,
            comboSource: 'Company'
        },
        concessionaries_props: {
            label: "Concessionárias % (admin)",
            isList: true
        },
    },
    labelField: 'name',
    gridFields: ['name', 'operator_name'],
    tableLabel: 'Blocos',
    labelSingular: 'Bloco',
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
            'concessionários': 'concessionaries',
            'atualizações': 'updates',
        }
    },
    referencedObjectsOnView:  [
        {
            queryName: 'wellsByBlock',
            title: 'Poços'
        },
        {
            queryName: 'comercialDeclarationsByBlock',
            title: 'Declarações de Comercialidade'
        },
        {
            queryName: 'seismicsByBlock',
            title: 'Autorizações'
        },
        {
            queryName: 'hydrocarbonEvidencesByBlock',
            title: 'Indícios de hidrocarbonetos'
        },
        {
            queryName: 'productionUnitByBlock',
            title: 'Unidades de produção'
        },
    ]
}

export = Block;