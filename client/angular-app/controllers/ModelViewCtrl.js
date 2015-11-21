angular.module('ModelViewCtrl', []).controller('ModelViewController', 
                ['$scope', 'server', '$routeParams', '$location',
        function($scope, server, $routeParams, $location) {

    var modelName = $routeParams.model;
    server.getTable(modelName, showModel, showError );
    
    function showModel(model) {
        $scope.viewParams = model.viewParams;
        $scope.records = model.records;
    }
    
    function showError(error) {
        $scope.error = error;
        console.log('Erros: ' + error);
    }
    
    $scope.showMap = function() {
         $location.path("/app/map").search({ model: modelName });
    }
}]);