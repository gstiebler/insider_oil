'use strict';
angular.module('InsiderOilApp').controller('ViewRecordController', 
                ['$scope', 'server', '$routeParams', 'showError', 'Flash', 'DateService',
        function($scope, server, $routeParams, showError, Flash, DateService) {
    
    const source = $routeParams.source;
    const id = $routeParams.id;
    $scope.id = id;
    $scope.source = source;
    
    $scope.relatedPersons = {
        queryName: 'PersonsByProject',
        filters: {
            project_id: id,
            dataSource: source
        }
    }
    
    $scope.relateNews = {
        dataSource: 'News',
        queryName: 'NewsByObject',
        filters: {
            modelName: source,
            id: id
        }
    }
    
    // show record values
    function showValues(viewData) {
        const record = viewData.record;
        for(var i = 0; i < record.length; i++) {
            if(record[i].type == 'DATE') {
                record[i].value = DateService.dateFormat(record[i].value);
            } else if(record[i].type == 'DATETIME') {
                record[i].value = DateService.parseDateTime(record[i].value);
            }
        }
        $scope.record = record;
        $scope.referencedObjects = viewData.referencedObjects;
    }
    server.viewRecord( source, id, showValues, showError.show );
}]);