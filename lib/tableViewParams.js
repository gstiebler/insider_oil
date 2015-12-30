"use strict";

exports.Well = {
        fields: {
            name: {
                label: "Poço"
            },
            operator_name: {
                label: "Operador"
            },
            operator_id: {
                label: "Operador"
            },
            state: {
                label: "Estado"
            },
            bacia: {
                label: "Bacia"
            },
            lat: {
                label: "Latitude"
            },
            lng: {
                label: "Longitude"
            }
        },
        labelField: "name",
        gridFields: ["name", "operator_name", "state", "bacia"],
        tableLabel: "Poços",
        hasMap: true
}


exports.DrillingRigOffshore = {
    fields: {
        name: {
            label: "Sonda Offshore"
        },
        contractor_name: {
            label: "Contratante"
        },
        contractor_id: {
            label: "Contratante"
        },
        type: {
            label: "Tipo"
        },
        status: {
            label: "Status"
        },
        lda: {
            label: "LDA"
        },
        start: {
            label: "Início"
        },
        end: {
            label: "Fim"
        }
    },
    labelField: "name",
    gridFields: ["name", "contractor_name", "type", "status", "lda", "start", "end"],
    tableLabel: "Sondas offshore",
    hasMap: false
}


exports.Company = {
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


exports.Person = {
    fields: {
        name: {
            label: "Nome"
        },
        phone: {
            label: "Telefone"
        },
        company_name: {
            label: "Empresa"
        },
        company_id: {
            label: "Empresa"
        }
    },
    labelField: "name",
    gridFields: ["name", "company_name"],
    tableLabel: "Pessoas",
    hasMap: false
}


exports.OilField = { 
    fields: {
        name: {
            label: "Nome"
        },
        basin: {
            label: "Bacia"
        },
        state: {
            label: "Estado"
        },
        concessionaries: {
            label: "Concessionárias"
        },
        userShore: {
            label: "Terra/Mar"
        }
    },
    labelField: "name",
    gridFields: ['name', 'basin', 'state', 'concessionaries', 'userShore'],
    tableLabel: "Campos",
    hasMap: false
};
