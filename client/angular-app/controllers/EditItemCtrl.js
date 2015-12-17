angular.module('EditItemCtrl', ['flash', 'ui.bootstrap']).controller('EditItemController', 
                ['$scope', 'server', '$routeParams', '$location', 'showError', 'Flash',
        function($scope, server, $routeParams, $location, showError, Flash) {
    
    var modelName = $routeParams.modelName;
    var id = $routeParams.id;
    server.getModelFieldsAndValues(modelName, id, valuesArrived, showError.show);
    
    function valuesArrived(data) {
        var fields = data.fields;
        for( var i = 0; i < fields.length; i++ ) {
            var field = fields[i];
            field.hasRef = field.type == 'ref';
            field.isDate = field.type == 'DATETIME';
            if( field.hasRef ) {
                data.values[field.name] = data.values[field.name].toString();
                function onValues(values) {
                    field.values = values;
                }
                
                server.getComboValues( field.model, onValues, showError.show );
            }
        }
    
        $scope.fields = fields;
        $scope.values = data.values;
    }
    
    $scope.saveItem = function() {
        var itemData = {};
        for( var i = 0; i < $scope.fields.length; i++ )  {
            var field = $scope.fields[i];
            itemData[field.name] = $scope.values[field.name];
        }
        itemData.id = id;    
        server.saveItem( modelName, itemData, onSave, showError.show );
    }
    
    function onSave(status) {
        Flash.create('success', status.data.msg);
        $location.path("/app/model_view").search({ model: modelName });
    }
    
}]);