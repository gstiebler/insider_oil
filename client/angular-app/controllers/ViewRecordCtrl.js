'use strict';
angular.module('InsiderOilApp').controller('ViewRecordController', 
                ['$scope', 'server', '$routeParams', 'showError', '$location',
        function($scope, server, $routeParams, showError, $location) {
    
    var source = $routeParams.source;
    var id = $routeParams.id;
    {
        var customSources = {
            'OilField': "/app/oil_field",
            'GasPipeline': "/app/gas_pipeline",
            'ProductionUnit': "/app/production_unit",
        };

        var customSource = customSources[source];
        if(customSource) {
            $location.path(customSource).search({ id: id });
        }
    }
    
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
    
    $scope.relatedBids = {
        queryName: 'BidsByObject',
        title: 'Licitações',
        filters: {
            obj_id: id,
            dataSource: source
        }
    }
    
    $scope.relatedContracts = {
        queryName: 'contractsByObject',
        title: 'Contratos',
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