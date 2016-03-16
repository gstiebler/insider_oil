'use strict';
var app = angular.module('ManyToManyDirective', []);

app.directive('manyToMany', ['server', function(server) {
    return {
        restrict: 'E',
        scope: {
            modelValues: '=ngModel',
            comboSource: '=ngComboSource',
            onError: '=ngOnError'
        },
        controller: ['$scope', function($scope) { 
            if(!$scope.modelValues)
                $scope.modelValues = [];
                
            server.getComboValues($scope.comboSource, onComboValues, $scope.onError);
            
            function onComboValues(values) {
                $scope.comboValues = values;
                
                $scope.comboValuesMap = {};
                for(var i = 0; i < values.length; i++) {
                    $scope.comboValuesMap[values[i].id] = values[i].label;
                }
            }
            
            function add() {
                const selectedId = $scope.selectedId;
                const label = $scope.comboValuesMap[selectedId].label;
                const newItem = {
                    id: itemId,
                    name: label
                };
                $scope.modelValues.push(newItem);
            }
        }],
        templateUrl: 'app/directives/templates/many_to_many.html'
    };
}]);