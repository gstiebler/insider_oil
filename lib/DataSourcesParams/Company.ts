import BaseDataSourceParams = require('./BaseDataSourceParams');

const Company: BaseDataSourceParams = {
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
            label: "Site"
        },
        telephones: {
            label: 'Telefone',
            isList: true  
        },
    },
    labelField: "name",
    gridFields: ["name", "address"],
    tableLabel: "Empresas",
    hasMap: false
}

export = Company;