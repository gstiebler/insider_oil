'use strict';
angular.module('InsiderOilApp').controller('ViewRecordController', 
                ['$scope', 'server', '$routeParams', 'showError', 
        function($scope, server, $routeParams, showError) {
    
    const source = $routeParams.source;
    const id = $routeParams.id;
    $scope.id = id;
    $scope.source = source;
    $scope.onError = showError.show;
    
    $scope.relatedPersons = {
        queryName: 'PersonsByProject',
        title: 'Pessoas',
        filters: {
            project_id: id,
            dataSource: source
        }
    }
    
    // show record values
    function showValues(viewData) {
        $scope.recordData = viewData.record;
        $scope.referencedObjects = viewData.referencedObjects;
    }
    server.viewRecord( source, id, showValues, showError.show );
}]);