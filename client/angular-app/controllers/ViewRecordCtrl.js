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
        title: 'Pessoas',
        filters: {
            project_id: id,
            dataSource: source
        }
    }
    
    const relateNewsQuery = {
        queryName: 'NewsByObject',
        title: 'Notícias',
        filters: {
            modelName: source,
            id: id
        }
    }
    server.getQueryData(relateNewsQuery, onNews, showError.show);
    
    function onNews(newsData) {
        $scope.newsData = newsData.records;
    }
    
    
    // show record values
    function showValues(viewData) {
        $scope.recordData = viewData.record;
        $scope.referencedObjects = viewData.referencedObjects;
    }
    server.viewRecord( source, id, showValues, showError.show );
}]);