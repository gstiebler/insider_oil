angular.module('EditItemCtrl', []).controller('EditItemController', 
                ['$scope', 'server', '$routeParams', '$location',
        function($scope, server, $routeParams, $location) {
        
    var modelName = $routeParams.modelName;
    var id = $routeParams.id;
    server.getModelFieldsAndValues(modelName, id, valuesArrived, onError);
    
    function valuesArrived(data) {
        var fields = data.fields;
        for( var i = 0; i < fields.length; i++ ) 
            fields[i].htmlId = getHtmlId(fields[i]);
    
        $scope.fields = fields;
        $scope.values = data.values;
    }
    
    function onError(err) {
        console.log(err);
    }
    
    function getHtmlId(field) {
        return "html_id_" + field.label;
    }
    
}]);