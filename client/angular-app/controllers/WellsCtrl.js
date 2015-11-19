angular.module('WellsCtrl', []).controller('WellsController', 
                ['$scope', 'server', 
        function($scope, server) {

    server.getTable('Well', showWell, showError );
    
    function showWell(wells) {
        $scope.wells = wells;
    }
    
    function showError(error) {
        $scope.error = error;
        console.log('Erros: ' + error);
    }
}]);