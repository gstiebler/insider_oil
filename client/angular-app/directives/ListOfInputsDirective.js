'use strict';
var app = angular.module('ListOfInputsDirective', []);

app.directive('listOfInputs', function() {
    return {
        restrict: 'E',
        scope: {
            modelValues: '=ngModel'
        },
        controller: ['$scope', function($scope) { 
            $scope.range = function(max) {
                const res = [];
                for(var i = 0; i < max; i++)
                    res.push(i);
                return res;
            }
        }],
        template: '<table style="width:100%">\
                      <tr>\
                         <td width="300">\
                        <div ng-repeat="n in range(modelValues.length)">\
                            <input type="text" ng-model="modelValues[n]"><br>\
                        </div>\
                       </td>\
                       <td>\
                           <button class="btn btn-default" ng-click="modelValues.push(\'\')">Adicionar</button><br>\
                           <button class="btn btn-default" ng-click="modelValues.pop()">Remover</button>\
                       </td>\
                     <tr>\
                   </table>'
    };
});