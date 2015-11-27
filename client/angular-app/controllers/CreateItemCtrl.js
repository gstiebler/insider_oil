angular.module('CreateItemCtrl', []).controller('CreateItemController', 
                ['$scope', 'server', '$routeParams', '$location',
        function($scope, server, $routeParams, $location) {

    var modelName = $routeParams.model;
    server.getModelFields(modelName, fieldsArrived, onError);
    
    function fieldsArrived(fields) {
        for( var i = 0; i < fields.length; i++ ) 
            fields[i].htmlId =  getHtmlId(fields[i]);
    
        $scope.fields = fields;
    }
    
    function onError(err) {
        console.log(err);
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
    
    function onError(error) {
        console.log(error);
    }
        
}]);