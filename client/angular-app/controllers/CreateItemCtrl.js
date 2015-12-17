angular.module('CreateItemCtrl', ['flash', 'ui.bootstrap']).controller('CreateItemController', 
                ['$scope', 'server', '$routeParams', '$location', 'showError', 'Flash',
        function($scope, server, $routeParams, $location, showError, Flash) {
    
    var modelName = $routeParams.model;
    server.getModelFields(modelName, fieldsArrived, showError.show);
    
    $scope.values = {};
    function fieldsArrived(fields) {
        for( var i = 0; i < fields.length; i++ ) {
            var field = fields[i];
            $scope.values[field.name] = "";
            field.hasRef = field.type == 'ref';
            field.isDate = field.type == 'DATETIME';
            if( field.hasRef ) {
                function onValues(values) {
                    field.values = values;
                }
                
                server.getComboValues( field.model, onValues, showError.show );
            }
        }
    
        $scope.fields = fields;
    }
    
    $scope.saveItem = function() {
        var itemData = {};
        for( var i = 0; i < $scope.fields.length; i++ )  {
            var field = $scope.fields[i];
            itemData[field.name] = $scope.values[field.name];
        }
            
        server.createNewItem( modelName, itemData, onSave, showError.show );
    }
    
    function onSave(status) {
        Flash.create('success', status.data.msg);
        $location.path("/app/model_view").search({ model: modelName });
    }
        
}]);