'use strict';
angular.module('InsiderOilApp').controller('ViewRecordController', 
                ['$scope', 'server', '$routeParams', 'showError', 'Flash', 'DateService',
        function($scope, server, $routeParams, showError, Flash, DateService) {
    
    const source = $routeParams.source;
    const id = $routeParams.id;
    $scope.id = id;
    $scope.source = source;
    
    // show record values
    function showValues(record) {
        $scope.record = record;
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