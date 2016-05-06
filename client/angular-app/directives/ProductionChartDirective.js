'use strict';

var app = angular.module('ProductionChartDirective', []);

var _server;
var _$pc_scope;

function queryParamsChanged(qParams) {
     var query = { 
        queryName: _$pc_scope.queryName,
        queryParams: qParams
     }
     console.log('prod chart', query);
    //_server.getProduction(query, onData, _$pc_scope.onError);
}

app.directive('productionChart', function() {
    return {
        restrict: 'E',
        scope: {
            queryName: '=queryName',
            qParams: '=qParams',
            onError: '=onError',
        },
        controller:['$scope', 'server', function($scope, server) {
            _server = server;
            _$pc_scope = $scope;
            $scope.$watch('qParams', queryParamsChanged);
        }],
        templateUrl: 'app/directives/templates/production_chart.html'
    };
});