'use strict';
var app = angular.module('EditRecordFieldsDirective', []);

app.directive('recordFields', function() {
    return {
        restrict: 'E',
        scope: {
            fields: '=ngFields',
            values: '=ngValues',
            onError: '=onError'
        },
        controller: ['$scope', 'server', function($scope, server) {
            $scope.dateFormat = 'dd/MM/yyyy';
            
            $scope.$watch('fields', function(fields){
                if(!fields)
                    return;
                
                function getHtmlId(field) {
                    return "html_id_" + field.name;
                }
                
                for( var i = 0; i < fields.length; i++ ) {
                    const field = fields[i];
                    field.htmlId = getHtmlId(field);
                    field.hasRef = field.type == 'ref';
                    field.isDate = field.type == 'DATE';
                    if( field.hasRef ) {
                        $scope.values[field.name] = $scope.values[field.name].toString();
                        
                        server.getComboValues( field.model, function (values) {
                            field.values = values;
                        }, $scope.onError );
                    }
                    if(field.isDate) {
                        const dateStr = $scope.values[field.name];
                        const date = new Date(dateStr);
                        date.setTime( date.getTime() + date.getTimezoneOffset()*60*1000 ); // correction for timezone
                        $scope.values[field.name] = date;
                    }
                }
            });  
        }],
        template: '<div class="form-group" ng-repeat="field in fields">\
                    <label class="control-label col-sm-2" for="{{field.htmlId}}">{{field.label}}:</label>\
                    <div class="col-sm-10">\
                        <div ng-if="!field.hasRef" >\
                            <input ng-if="!field.isDate" type="text" class="form-control" id="{{field.htmlId}}" ng-model="values[field.name]"/>\
                            <p class="input-group" ng-if="field.isDate" >\
                                <input type="text" class="form-control" uib-datepicker-popup="{{dateFormat}}" id="{{field.htmlId}}" ng-model="values[field.name]" is-open="id_opened" ng-required="true" />\
                                <span class="input-group-btn">\
                                    <button type="button" class="btn btn-default" ng-click="id_opened=true"><i class="glyphicon glyphicon-calendar"></i></button>\
                                </span>\
                            </p>\
                        </div>\
                        <select ng-if="field.hasRef" class="form-control" ng-model="values[field.name]" id="{{field.htmlId}}"  >\
                            <option ng-repeat="value in field.values" value="{{value.id}}" >{{value.label}}</option>\
                        </select>\
                    </div>\
                </div>'
    };
});