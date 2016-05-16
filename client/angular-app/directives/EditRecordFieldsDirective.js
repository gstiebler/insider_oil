'use strict';

/*****************
This directive is used to show different edit components in the 
create and edit item
******************/

var app = angular.module('EditRecordFieldsDirective', []);

function getOnComboValuesFn(field) {
    
    function onComboValues(values) {
        field.values = values;
    }
    
    return onComboValues;
}

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
            $scope.dateTimeFormat = 'dd/MM/yyyy HH:mm';
            
            $scope.$watch('fields', function(fields){
                if(!fields)
                    return;
                
                function getHtmlId(field) {
                    return "html_id_" + field.name;
                }
                
                var hasValues = $scope.values && Object.keys($scope.values).length > 0;
                for( var i = 0; i < fields.length; i++ ) {
                    var field = fields[i];
                    field.htmlId = getHtmlId(field);
                    field.hasRef = field.type == 'ref';
                    field.isDate = field.type == 'DATE';
                    field.isDateTime = field.type == 'DATETIME';
                    if( field.hasRef ) {
                        if(hasValues) 
                            $scope.values[field.name] = $scope.values[field.name].toString();
                        
                        server.getComboValues( field.model, getOnComboValuesFn(field), $scope.onError );
                    }
                    if(field.isDate && hasValues) {
                        var dateStr = $scope.values[field.name];
                        if(dateStr) {
                            var date = new Date(dateStr);
                            // TODO use moment.js
                            date.setTime( date.getTime() + date.getTimezoneOffset()*60*1000 ); // correction for timezone
                            $scope.values[field.name] = date;
                        }
                    }
                    if(field.isPhoto && hasValues) {
                        var fieldValues = $scope.values[field.name];
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