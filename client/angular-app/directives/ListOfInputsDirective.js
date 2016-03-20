'use strict';

/*****************/
This directive is used to show a list of items in the
create and edit page
******************/

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
                
            $scope.range = _.range;
        }],
        templateUrl: 'app/directives/templates/list_of_inputs.html'
    };
});