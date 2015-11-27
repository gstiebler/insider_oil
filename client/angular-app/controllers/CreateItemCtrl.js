angular.module('CreateItemCtrl', []).controller('CreateItemController', 
                ['$scope', 'server', '$routeParams', '$location',
        function($scope, server, $routeParams, $location) {

    var modelName = $routeParams.model;
    server.getModelFields(modelName, fieldsArrived, onError);
    
    function fieldsArrived(fields) {
        $scope.fields = fields;
    }
    
    function onError(err) {
        console.log(err);
    }
        
}]);