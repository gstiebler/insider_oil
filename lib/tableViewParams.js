"use strict";

exports.Well = function() {
    var wellsParams = {
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
    };
    
    return wellsParams;
}


exports.DrillingRig = function() {
    var drillingRigsParams = {
        fields: {
            name: {
                label: "Sonda"
            },
            contractor_name: {
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
        tableLabel: "Sondas",
        hasMap: false
    };
    
    return drillingRigsParams;
}


exports.Company = function() {
    var companiesParams = {
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
    };
    
    return companiesParams;
}