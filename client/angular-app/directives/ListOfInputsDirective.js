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
                
            $scope.range = function(max) {
                const res = [];
                for(var i = 0; i < max; i++)
                    res.push(i);
                return res;
            }
        }],
        templateUrl: 'app/directives/templates/list_of_inputs.html'
    };
});