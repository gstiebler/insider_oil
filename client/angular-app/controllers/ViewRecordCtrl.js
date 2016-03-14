'use strict';
angular.module('InsiderOilApp').controller('ViewRecordController', 
                ['$scope', 'server', '$routeParams', 'showError', 'Flash', 'DateService',
        function($scope, server, $routeParams, showError, Flash, DateService) {
    
    const source = $routeParams.source;
    const id = $routeParams.id;
    $scope.id = id;
    $scope.source = source;
    
    // show record values
    function showValues(viewData) {
        const record = viewData.record;
        for(var i = 0; i < record.length; i++) {
            if(record[i].type == 'DATE') {
                record[i].value = DateService.dateFormat(record[i].value);
            }
        }
        
        $scope.record = record;
        
        const referencedObjects = viewData.referencedObjects;
        if(referencedObjects) {
            for(var i = 0; i < referencedObjects.length; i++) {
                const filterField = referencedObjects[i].filterField;
                const filter = {};
                filter[filterField] = id;
                server.getTable(referencedObjects[i].dataSource, filter, 
                function(records) {
                    console.log(records);
                }, showError.show);
            }
        }
    }
    server.viewRecord( source, id, showValues, showError.show );
    
    // show record news
    function showNews(news) {
    	for(var i = 0; i < news.length; i++) {
    		news[i].formattedCreatedAt = DateService.parseDateTime(news[i].created_at);
    	}
    	
    	$scope.news = news;
    }
    server.newsFromObject(source, id, showNews, showError.show);

}]);