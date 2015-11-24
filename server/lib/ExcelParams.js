exports.DrillingRig = function() {
    var params = {
        fields: {},
        keyField: "sonda"
    };
    params.fields["tipo"] = "type";
    params.fields["sonda"] = "name";
    params.fields["contratada"] = "contractor";
    params.fields["status"] = "status";
    params.fields["lda"] = "lda";
    params.fields["início"] = "start";
    params.fields["fim"] = "end";
    return params;
}