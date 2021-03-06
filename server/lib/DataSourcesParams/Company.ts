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
        main_person_id: {
            label: "Head"
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
        {
            queryName: 'blocksOperatedByCompany',
            title: 'Blocos operados'
        },
        {
            queryName: 'oilFieldsOperatedByCompany',
            title: 'Campos operados'
        },
        {
            queryName: 'blocksConcessionaryByCompany',
            title: 'Participação em blocos exploratórios'
        },
        {
            queryName: 'oilFieldConcessionaryByCompany',
            title: 'Participação em campos'
        },
        {
            queryName: 'drillingRigsByContractor',
            title: 'Sondas contratadas'
        },
        {
            queryName: 'drillingRigsByOperator',
            title: 'Sondas operadas'
        },
        {
            queryName: 'productionUnitsByOperator',
            title: 'Unidades de produção operadas'
        },
        {
            queryName: 'productionUnitsByOwner',
            title: 'Unidades de produção próprias'
        },
        {
            queryName: 'contractsBySupplier',
            title: 'Contratos fornecidos'
        },
        {
            queryName: 'boatsByOwner',
            title: 'Barcos de apoio'
        },
        {
            queryName: 'contractsByContractor',
            title: 'Contratos'
        },
    ],
    labelField: "name",
    gridFields: ["name", "address"],
    tableLabel: "Empresas",
    labelSingular: 'Empresa',
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