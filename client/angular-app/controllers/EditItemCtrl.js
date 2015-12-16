angular.module('EditItemCtrl', ['flash']).controller('EditItemController', 
                ['$scope', 'server', '$routeParams', '$location', 'showError', 'Flash',
        function($scope, server, $routeParams, $location, showError, Flash) {
    
    var modelName = $routeParams.modelName;
    var id = $routeParams.id;
    server.getModelFieldsAndValues(modelName, id, valuesArrived, showError.show);
    
    function valuesArrived(data) {
        var fields = data.fields;
        for( var i = 0; i < fields.length; i++ ) {
            var field = fields[i];
            field.htmlId = getHtmlId(fields[i]);
            field.hasRef = field.type == 'ref';
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
    
    function getHtmlId(field) {
        return "html_id_" + field.name;
    }    
    
    $scope.saveItem = function() {
        var itemData = {};
        for( var i = 0; i < $scope.fields.length; i++ )  {
            var field = $scope.fields[i];
            
            var htmlElement = document.getElementById( getHtmlId(field) );
            itemData[field.name] = htmlElement.value;
        }
        itemData.id = id;    
        server.saveItem( modelName, itemData, onSave, showError.show );
    }
    
    function onSave() {
        Flash.create('success', 'Registro salvo com sucesso.');
        $location.path("/app/model_view").search({ model: modelName });
    }
    
}]);