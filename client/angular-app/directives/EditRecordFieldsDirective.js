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
                
                const hasValues = $scope.values && Object.keys($scope.values).length > 0;
                for( var i = 0; i < fields.length; i++ ) {
                    const field = fields[i];
                    field.htmlId = getHtmlId(field);
                    field.hasRef = field.type == 'ref';
                    field.isDate = field.type == 'DATE';
                    if( field.hasRef ) {
                        if(hasValues)
                            $scope.values[field.name] = $scope.values[field.name].toString();
                        
                        server.getComboValues( field.model, function (values) {
                            field.values = values;
                        }, $scope.onError );
                    }
                    if(field.isDate && hasValues) {
                        const dateStr = $scope.values[field.name];
                        if(dateStr) {
                            const date = new Date(dateStr);
                            date.setTime( date.getTime() + date.getTimezoneOffset()*60*1000 ); // correction for timezone
                            $scope.values[field.name] = date;
                        }
                    }
                    if(field.isPhoto && hasValues) {
                        const fieldValues = $scope.values[field.name];
                        if(fieldValues && fieldValues.data) {
                            $scope.values[field.name] = fieldValues.data;
                        }
                    }
                }
            });  
        }],
        templateUrl: 'app/directives/templates/edit_record.html'
    };
});