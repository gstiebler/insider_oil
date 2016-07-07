'use strict';

var app = angular.module('ObjectNewsDirective', []);

var _server;
var _$scope;

function onObjIdChange(objId) {
    var relateNewsQuery = {
        queryName: 'NewsByObject',
        title: 'Notícias',
        filters: {
            modelName: _$scope.modelName,
            id: objId
        }
    }
    _server.getQueryData(relateNewsQuery, onNews, _$scope.onError);
    
    function onNews(newsData) {
        _$scope.newsData = newsData.records;
    }
}

app.directive('objectNews', function() {
    return {
        restrict: 'E',
        scope: {
            modelName: '=modelName',
            objId: '=objId',
            onError: '=onError',
        },
        controller:['$scope', 'server', 'DateService', function($scope, server, DateService) {
            _server = server;
            _$scope = $scope;
            $scope.dateFormat = DateService.dateFormat;
            $scope.$watch('objId', onObjIdChange);
        }],
        templateUrl: 'app/directives/templates/object_news.html'
    };
});