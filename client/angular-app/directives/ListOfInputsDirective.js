var app = angular.module('ListOfInputsDirective', []);

app.directive('listOfInputs', function() {
    return {
        restrict: 'E',
        scope: {
            modelValues: '=ngModel'
        },
        controller: ['$scope', function($scope) { 
        }],
        template: '<table style="width:100%">\
                      <tr>\
                         <td width="300">\
                        <div ng-repeat="n in range(modelValues.length) track by $index">\
                            {{n}}\
                            {{$index}}\
                            <input type="text" value="modelValues[n]"><br>\
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