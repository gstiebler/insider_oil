angular.module('CreateItemCtrl', []).controller('CreateItemController', 
                ['$scope', 'server', '$routeParams', '$location',
        function($scope, server, $routeParams, $location) {

    function onError(err) {
        console.log(err);
    }
    
    var modelName = $routeParams.model;
    server.getModelFields(modelName, fieldsArrived, onError);
    
    function fieldsArrived(fields) {
        for( var i = 0; i < fields.length; i++ ) {
            fields[i].htmlId = getHtmlId(fields[i]);
            fields[i].hasRef = fields[i].type == 'ref';
            if( fields[i].hasRef ) {
                var field = fields[i];
                function onValues(values) {
                    field.values = values;
                }
                
                server.getComboValues( field.model, onValues, onError );
            }
        }
    
        $scope.fields = fields;
    }
    
    function getHtmlId(field) {
        return "html_id_" + field.label;
    }
    
    $scope.createNewItem = function() {
        var itemData = {};
        for( var i = 0; i < $scope.fields.length; i++ )  {
            var field = $scope.fields[i];
            
            var htmlElement = document.getElementById( getHtmlId(field) );
            itemData[field.name] = htmlElement.value;
        }
            
        server.createNewItem( modelName, itemData, onSave, onError );
    }
    
    function onSave() {
         $location.path("/app/model_view").search({ model: modelName });
    }
        
}]);