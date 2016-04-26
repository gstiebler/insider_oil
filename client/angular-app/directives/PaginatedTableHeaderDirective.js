'use strict';

var app = angular.module('PaginatedTableHeaderDirective', []);

let paginatedHeaderController = ['$scope',
function($scope) {
    var delayTimer;
    $scope.$watch('filterText', function(value) {
        clearTimeout(delayTimer);
        delayTimer = setTimeout(function() {
            console.log(value);
        }, 400);
    });
    
    $scope.$watch('headerParams', function(headerParams) {
        console.log(headerParams);
        $scope.label = headerParams.label;
        $scope.filterFields = headerParams.filterFields;
        $scope.selectedFilter = headerParams.filterFields[0].data;
    });
}];

app.directive('paginatedTableHeader', function() {
    return {
        restrict: 'E',
        scope: {
            headerParams: '=headerParams',
        },
        controller: paginatedHeaderController,
        templateUrl: 'app/directives/templates/paginated_table_header.html'
    };
});