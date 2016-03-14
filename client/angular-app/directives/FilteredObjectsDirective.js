'use strict';
var app = angular.module('FilteredObjectsDirective', []);

app.directive('filteredObjects', ['server', function(server) {
    return {
        restrict: 'E',
        scope: {
            referencedObject: '=ngModel',
            id: '=ngId',
            onError: '=ngOnError'
        },
        controller: ['$scope', function($scope) {
            const referencedObject = $scope.referencedObject;
            const filterField = referencedObject.filterField;
            const filter = {};
            filter[filterField] = $scope.id;
            server.getTable(referencedObject.dataSource, filter, 
            function(records) {
                console.log(records);
            }, $scope.onError);
        }],
       // templateUrl: 'app/directives/templates/filtered_objects.html'
    };
}]);