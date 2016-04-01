import BaseDataSourceParams = require('./BaseDataSourceParams');

const Company: BaseDataSourceParams = {
    fields: {
        name: {
            label: "Empresa"
        },
        address: {
            label: "Endereço"
        }
    },
    labelField: "name",
    gridFields: ["name", "address"],
    tableLabel: "Empresas",
    hasMap: false
}

export = Company;