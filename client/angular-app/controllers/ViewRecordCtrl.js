'use strict';
angular.module('ViewRecordCtrl', ['flash', 'ui.bootstrap', 'ngSanitize']).controller('ViewRecordController', 
                ['$scope', 'server', '$routeParams', 'showError', 'Flash',
        function($scope, server, $routeParams, showError, Flash) {
    
    var source = $routeParams.source;
    var id = $routeParams.id;
    
    // show record values
    function showValues(record) {
        $scope.record = record;
    }
    server.viewRecord( source, id, showValues, showError.show );
        
    function parseDateTime(dateTimeStr) {
    	const date = new Date(dateTimeStr);
    	return date.toLocaleString();
    }
    
    // show record news
    function showNews(news) {
    	for(var i = 0; i < news.length; i++) {
    		news[i].formattedCreatedAt = parseDateTime(news[i].created_at);
    	}
    	
    	$scope.news = news;
    }
    server.newsFromObject(source, id, showNews, showError.show);

}]);