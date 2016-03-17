'use strict';
angular.module('InsiderOilApp').controller('EditItemController', 
                ['$scope', 'server', '$routeParams', '$location', 'showError', 'Flash',
        function($scope, server, $routeParams, $location, showError, Flash) {
    
    var modelName = $routeParams.modelName;
    var id = $routeParams.id;
    server.getModelFieldsAndValues(modelName, id, valuesArrived, showError.show);
    
    function valuesArrived(data) {
        $scope.values = data.values;
        $scope.fields = data.fields;
    }
    
    $scope.saveItem = function() {
        var itemData = {};
        for(var prop in $scope.values)  {
            var value = $scope.values[prop];
            if(value == undefined)
                value = null;
            itemData[prop] = value;
        }
        itemData.id = id;    
        server.saveItem( modelName, itemData, onSave, showError.show );
    }
    
    function onSave(status) {
        Flash.create('success', status.data.msg);
        $location.path("/app/model_view").search({ model: modelName });
    }
    
    $scope.onError = showError.show;
}]);