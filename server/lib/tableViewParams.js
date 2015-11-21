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
            }
        },
        labelField: "name",
        gridFields: ["name", "operator", "state", "bacia"],
        tableLabel: "Poços",
        hasMap: true
    };
    
    return wellsParams;
}