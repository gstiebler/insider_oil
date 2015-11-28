exports.Well = function() {
    var wellsParams = {
        fields: {
            name: {
                label: "Poço"
            },
            operator: {
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
        gridFields: ["name", "operator", "state", "bacia"],
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
            contractor: {
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
        gridFields: ["name", "contractor", "type", "status", "lda", "start", "end"],
        tableLabel: "Sondas",
        hasMap: false
    };
    
    return drillingRigsParams;
}