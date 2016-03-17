'use strict';
angular.module('InsiderOilApp').controller('CreateItemController', 
                ['$scope', 'server', '$routeParams', '$location', 'showError', 'Flash',
        function($scope, server, $routeParams, $location, showError, Flash) {
    
    var modelName = $routeParams.model;
    server.getModelFields(modelName, fieldsArrived, showError.show);
     
    $scope.values = {};
    function fieldsArrived(fields) {
        $scope.fields = fields;
    }
    
    $scope.saveItem = function() {
        server.createNewItem( modelName, $scope.values, onSave, showError.show );
    }
    
    function onSave(status) {
        Flash.create('success', status.data.msg);
        $location.path("/app/model_view").search({ model: modelName });
    }
    
    $scope.onError = showError.show;
}]);