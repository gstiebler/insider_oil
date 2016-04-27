'use strict';

var app = angular.module('PaginatedTableHeaderDirective', []);

let paginatedHeaderController = ['$scope',
function($scope) {
    var delayTimer;
    $scope.$watch('filterText', function(value) {
        clearTimeout(delayTimer);
        delayTimer = setTimeout(filterChanged, 400);
    });
    
    $scope.$watch('headerParams', function(headerParams) {
        $scope.label = headerParams.label;
        $scope.filterFields = headerParams.filterFields;
        var temp = headerParams.filterFields[0].data;
        $scope.selectedFilter = headerParams.filterFields[0].data;
    });
    
    $scope.$watch('selectedFilter', function(selectedFilter) {
        $scope.filterText = '';
        filterChanged();
    });
    
    function filterChanged() {
        var filterOpts = [
            {
                field: $scope.selectedFilter,
                like: $scope.filterText
            }
        ]
        if($scope.filterText == '')
            filterOpts = [];
          
        $scope.filterChanged(filterOpts);
    }
}];

app.directive('paginatedTableHeader', function() {
    return {
        restrict: 'E',
        scope: {
            headerParams: '=headerParams',
            filterChanged: '=filterChanged'
        },
        controller: paginatedHeaderController,
        templateUrl: 'app/directives/templates/paginated_table_header.html'
    };
});