'use strict';

/*****************
This directive is used to show records in a static table
The source of the records is a custom query
******************/

function controllerFunc($scope, server, DateService) {
    const referencedObject = $scope.referencedObject;
    $scope.title = 'Título';
    var filters = referencedObject.filters;
    if(!filters) {
        filters = {};
        filters.id = $scope.id;
    }
    
    const options = { 
        filters: filters,
        queryName: referencedObject.queryName
    };
    server.getQueryData(options, onData, $scope.onError);

    function onData(data) {
        const records = data.records;
        const fields = data.fields;
        
        const header = [];
        for(var i = 0; i < fields.length; i++) {
            const field = fields[i];
            header.push( field.label );
        }
        $scope.header = header;
        
        const showRecords = [];
        for(var i = 0; i < records.length; i++) {
            const recordValues = [];
            const record = records[i];
            for(var j = 0; j < fields.length; j++) {
                const item = {};
                const field = fields[j];
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