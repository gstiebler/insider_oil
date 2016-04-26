'use strict';

var app = angular.module('PaginatedTableHeaderDirective', []);

let paginatedHeaderController = ['$scope',
function($scope) { 
    _$scope = $scope;
    $scope.$watch('headerParams', function(headerParams) {
        console.log(headerParams);
        _$scope.label = headerParams.label;
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