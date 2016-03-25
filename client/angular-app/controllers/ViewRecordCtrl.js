'use strict';
angular.module('InsiderOilApp').controller('ViewRecordController', 
                ['$scope', 'server', '$routeParams', 'showError', 'Flash', 'DateService',
        function($scope, server, $routeParams, showError, Flash, DateService) {
    
    const source = $routeParams.source;
    const id = $routeParams.id;
    $scope.id = id;
    $scope.source = source;
    
    $scope.relatedPersons = {
        dataSource: 'Person',
        queryName: 'byProject',
        filters: {
            project_id: id,
            dataSource: source
        },
        showFields: [
            'name',
            'position'
        ]
    }
    
    $scope.relateNews = {
        dataSource: 'News',
        queryName: 'byObject',
        filters: {
            modelName: source,
            id: id
        },
        showFields: [
            'title',
            'created_at'
        ]
    }
    
    // show record values
    function showValues(viewData) {
        const record = viewData.record;
        for(var i = 0; i < record.length; i++) {
            if(record[i].type == 'DATE') {
                record[i].value = DateService.dateFormat(record[i].value);
            }
        }
        $scope.record = record;
        $scope.referencedObjects = viewData.referencedObjects;
    }
    server.viewRecord( source, id, showValues, showError.show );
}]);