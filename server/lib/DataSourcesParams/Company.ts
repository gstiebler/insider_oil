import { IBaseDataSourceParams } from '../../../common/Interfaces';

const Company: IBaseDataSourceParams = {
    fields: {
        name: {
            label: "Empresa"
        },
        address: {
            label: "Endereço"
        },
        logo: {
            label: "Logotipo",
            isPhoto: true
        },
        site: {
            label: "Site",
            isLink: true
        },
        telephones: {
            label: 'Telefone',
            isList: true  
        },
        segments: {
            label: 'Segmentos',
            isList: true  
        },
    },
    referencedObjectsOnView:  [
        {
            queryName: 'personsByCompany',
            title: 'Pessoas'
        },
    ],
    labelField: "name",
    gridFields: ["name", "address"],
    tableLabel: "Empresas",
    hasMap: false,
    excelParams: {
        keyField: "nome",
        fields: {
            'nome': 'name',
            'endereço': 'address',
            'site': 'site',
            'telefones': 'telephones',
        }
    },
}

export = Company;