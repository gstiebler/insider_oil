angular.module('CreateItemCtrl', ['flash']).controller('CreateItemController', 
                ['$scope', 'server', '$routeParams', '$location', 'Flash',
        function($scope, server, $routeParams, $location, Flash) {

    function onError(err) {
        var errorStr = err.data.errorMsg;
        console.log(err.data.errors);
        for( var i = 0; i < err.data.errors.length; i++ )
            errorStr += '\n' + err.data.errors[i].message;
        console.log(errorStr);
        Flash.create('warning', errorStr);
    }
    
    var modelName = $routeParams.model;
    server.getModelFields(modelName, fieldsArrived, onError);
    
    function fieldsArrived(fields) {
        for( var i = 0; i < fields.length; i++ ) {
            var field = fields[i];
            field.htmlId = getHtmlId(field);
            field.hasRef = field.type == 'ref';
            if( field.hasRef ) {
                function onValues(values) {
                    field.values = values;
                }
                
                server.getComboValues( field.model, onValues, onError );
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
            
        server.createNewItem( modelName, itemData, onSave, onError );
    }
    
    function onSave() {
         $location.path("/app/model_view").search({ model: modelName });
    }
        
}]);