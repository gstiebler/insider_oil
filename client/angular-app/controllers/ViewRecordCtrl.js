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
        
    // show record news
    function showNews(news) {
    	$scope.news = news;
    }
    server.newsFromObject(source, id, showNews, showError.show);

}]);