'use strict';
angular.module('AdminSourcesListCtrl', ['flash', 'ui.bootstrap']).controller('AdminSourcesListController', 
                ['$scope', 'server', '$routeParams', '$location', 'showError', 'Flash',
        function($scope, server, $routeParams, $location, showError, Flash) {
    
    function onData(sourcesList) {
        $scope.sourcesList = sourcesList;
    }
    
    server.sourceList( onData, showError.show );
    
}]);