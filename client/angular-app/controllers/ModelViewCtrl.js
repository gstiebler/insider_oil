angular.module('ModelViewCtrl', []).controller('ModelViewController', 
                ['$scope', 'server', '$routeParams',
        function($scope, server, $routeParams) {

    server.getTable($routeParams.model, showModel, showError );
    
    function showModel(model) {
        $scope.viewParams = model.viewParams;
        $scope.records = model.records;
    }
    
    function showError(error) {
        $scope.error = error;
        console.log('Erros: ' + error);
    }
}]);