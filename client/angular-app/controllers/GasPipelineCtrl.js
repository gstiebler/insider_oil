'use strict';
angular.module('InsiderOilApp').controller('GasPipelineController', 
                ['$scope', 'server', '$routeParams', 'showError', 
        function($scope, server, $routeParams, showError) {
    
    var source = 'GasPipeline';
    var id = $routeParams.id;
    $scope.id = id;
    $scope.source = source;
    $scope.onError = showError.show;
    $scope.movementsQueryParams = { gasPipeline: id };
    $scope.movementsChartParams = {
        yLabel: 'Movimentação',
        yAxis: 'value',
        xAxis: 'date_prod'
    };
        
    $scope.relatedPersons = {
        queryName: 'PersonsByProject',
        title: 'Pessoas',
        filters: {
            project_id: id,
            dataSource: source
        }
    }
    
    $scope.relatedBids = {
        queryName: 'BidsByObject',
        title: 'Licitações',
        filters: {
            obj_id: id,
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