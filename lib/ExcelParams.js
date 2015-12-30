exports.Well = function() {
    var params = {
        fields: {},
        keyField: "poco"
    };
    params.fields["poco"] = "name";
    params.fields["operadora"] = "operator";
    params.fields["estado"] = "state";
    params.fields["bacia"] = "bacia";
    params.fields["latitude_dd"] = "lat";
    params.fields["longitude_dd"] = "lng";
    return params;
}


exports.DrillingRigOffshore = function() {
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