'use strict';

/*****************
This directive is used to show records in a static table
The source of the records is a custom query
******************/

function controllerFunc($scope, server, DateService) {
    var referencedObject = $scope.referencedObject;
    $scope.title = referencedObject.title;
    var filters = referencedObject.filters;
    if(!filters) {
        filters = {};
        filters.id = $scope.id;
    }
    
    var options = { 
        filters: filters,
        queryName: referencedObject.queryName
    };
    server.getQueryData(options, onData, $scope.onError);

    function onData(data) {
        var records = data.records;
        var fields = data.fields;
        
        var header = [];
        for(var i = 0; i < fields.length; i++) {
            var field = fields[i];
            header.push( field.label );
        }
        $scope.header = header;
        
        var showRecords = [];
        for(var i = 0; i < records.length; i++) {
            var recordValues = [];
            var record = records[i];
            for(var j = 0; j < fields.length; j++) {
                var item = {};
                var field = fields[j];
                if(field.ref) {
                    item.model = record[field.ref.modelField];
                    item.id = record[field.ref.idField];
                    item.value = record[field.ref.valueField];
                } else {
                    var recordValue = record[field.fieldName];
                    if(field.type == 'DATE') {
                        recordValue = DateService.dateFormat(recordValue);
                    } else if(field.type == 'DATETIME') {
                        recordValue = DateService.parseDateTime(recordValue);
                    }
                    item.value = recordValue;
                }
                
                recordValues.push(item);
            }
            showRecords.push(recordValues);
        }
        $scope.records = showRecords;
    }
}


var app = angular.module('ShowQueryDataDirective', []);
app.directive('showQueryData', function() {
    return {
        restrict: 'E',
        scope: {
            referencedObject: '=ngModel',
            id: '=ngId',
            onError: '=ngOnError'
        },
        controller: ['$scope', 'server', 'DateService', controllerFunc],
       templateUrl: 'app/directives/templates/show_query_data.html'
    };
});