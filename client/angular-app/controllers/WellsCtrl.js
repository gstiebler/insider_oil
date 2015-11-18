angular.module('WellsCtrl', []).controller('WellsController', 
                ['$scope', 'server', 
        function($scope, server) {

    server.getTable('Well', showWell, showError );
    
    function showWell(wells) {
        $scope.wells = wells;
        console.log('Wells: ' + wells);
    }
    
    function showError(error) {
        $scope.error = error;
        console.log('Erros: ' + error);
    }
    
	$scope.tagline = 'Aqui os poços irão brilhar';	

}]);