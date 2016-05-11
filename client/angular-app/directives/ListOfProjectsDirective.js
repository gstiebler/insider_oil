'use strict';
var app = angular.module('ListOfProjectsDirective', []);

app.directive('listOfProjects', function() {
    return {
        restrict: 'E',
        scope: {
            projects: '=ngModel',
            showError: '=ngShowError'
        },
        controller: ['$scope', function($scope) {
            if(!$scope.projects)
                $scope.projects = [];
                
            $scope.removeItem = function(item) {
                var index = $scope.projects.indexOf(item);
                if (index > -1) {
                    // remove the item from the array
                    $scope.projects.splice(index, 1);
                }
            };
            
            $scope.onProjectSelected = function(selectedItem) {
                selectedItem.description = $scope.descriptionInput;
                $scope.projects.push(selectedItem);
                $scope.descriptionInput = "";
            };
        }],
        templateUrl: 'app/directives/templates/list_of_projects.html'
    };
});