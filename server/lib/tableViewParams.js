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