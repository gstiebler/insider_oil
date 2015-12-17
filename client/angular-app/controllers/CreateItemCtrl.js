angular.module('CreateItemCtrl', ['flash', 'ui.bootstrap']).controller('CreateItemController', 
                ['$scope', 'server', '$routeParams', '$location', 'showError', 'Flash',
        function($scope, server, $routeParams, $location, showError, Flash) {
    
    var modelName = $routeParams.model;
    server.getModelFields(modelName, fieldsArrived, showError.show);
    
    $scope.dt = new Date();
    
    function fieldsArrived(fields) {
        for( var i = 0; i < fields.length; i++ ) {
            var field = fields[i];
            field.htmlId = getHtmlId(field);
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
    
    function getHtmlId(field) {
        return "html_id_" + field.name;
    }
    
    $scope.createNewItem = function() {
        var itemData = {};
        for( var i = 0; i < $scope.fields.length; i++ )  {
            var field = $scope.fields[i];
            
            var htmlElement = document.getElementById( getHtmlId(field) );
            itemData[field.name] = htmlElement.value;
        }
            
        server.createNewItem( modelName, itemData, onSave, showError.show );
    }
    
    function onSave(status) {
        Flash.create('success', status.data.msg);
        $location.path("/app/model_view").search({ model: modelName });
    }
        
}]);