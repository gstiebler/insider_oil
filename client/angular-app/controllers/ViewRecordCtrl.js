'use strict';
angular.module('ViewRecordCtrl', ['flash', 'ui.bootstrap']).controller('ViewRecordController', 
                ['$scope', 'server', '$routeParams', '$location', 'showError', 'Flash',
        function($scope, server, $routeParams, $location, showError, Flash) {
    
    var source = $routeParams.source;
    var id = $routeParams.id;
    
    function showValues(record) {
        $scope.record = record;
    }
    
    server.viewRecord( source, id, showValues, showError.show );
    
}]);