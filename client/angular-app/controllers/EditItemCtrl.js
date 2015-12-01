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
    
    $scope.saveItem = function() {
        var itemData = {};
        for( var i = 0; i < $scope.fields.length; i++ )  {
            var field = $scope.fields[i];
            
            var htmlElement = document.getElementById( getHtmlId(field) );
            itemData[field.name] = htmlElement.value;
        }
        itemData.id = id;    
        server.saveItem( modelName, itemData, onSave, onError );
    }
    
    function onSave() {
         $location.path("/app/model_view").search({ model: modelName });
    }
    
}]);