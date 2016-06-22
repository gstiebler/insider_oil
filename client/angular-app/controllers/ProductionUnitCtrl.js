'use strict';
angular.module('InsiderOilApp').controller('ProductionUnitController', 
                ['$scope', 'server', '$routeParams', 'showError', 
        function($scope, server, $routeParams, showError) {
    
    var source = 'ProductionUnit';
    var id = $routeParams.id;
    $scope.id = id;
    $scope.source = source;
    $scope.onError = showError.show;
    $scope.prodQueryParams = { id: id };
        
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
    
    $scope.relatedMaintenanceDates = {
        queryName: 'maintenanceDatesByProductionUnit',
        title: 'Datas de manutenção',
        filters: {
            id: id
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