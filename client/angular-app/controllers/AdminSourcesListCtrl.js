'use strict';
angular.module('InsiderOilApp').controller('AdminSourcesListController', 
                ['$scope', 'server', '$routeParams', '$location', 'showError', 'Flash',
        function($scope, server, $routeParams, $location, showError, Flash) {
    
    function onData(sourcesList) {
        $scope.sourcesList = sourcesList;
    }
    
    server.sourceList( onData, showError.show );
    
    $scope.onProductionFileUploaded = function (status) {
        Flash.create('success', status );
    }
    
}]);