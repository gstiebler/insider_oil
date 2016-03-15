'use strict';
var app = angular.module('ListOfInputsDirective', []);

app.directive('listOfInputs', function() {
    return {
        restrict: 'E',
        scope: {
            modelValues: '=ngModel'
        },
        controller: ['$scope', function($scope) { 
            if(!$scope.modelValues)
                $scope.modelValues = [];
        }],
        templateUrl: 'app/directives/templates/list_of_inputs.html'
    };
});