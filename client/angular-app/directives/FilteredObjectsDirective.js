'use strict';

/*****************
This directive is used to show records in a static table
The source of the records is a custom query
******************/

function controllerFunc($scope, server, DateService) {
    const referencedObject = $scope.referencedObject;
    const showFields = referencedObject.showFields;
    var filters = referencedObject.filters;
    if(!filters) {
        filters = {};
        filters[referencedObject.filterField] = $scope.id;
    }
    $scope.dataSource = referencedObject.dataSource;
    
    if(referencedObject.queryName) {
        const options = { 
            filters: filters,
            queryName: referencedObject.queryName
        };
        server.getQueryData(referencedObject.dataSource, options, onData, $scope.onError);
    } else {
        const options = { 
            filters: filters,
            fieldNames: showFields
        };
        server.getTable(referencedObject.dataSource, options, onData, $scope.onError);
    }
    
    function onData(data) {
        const records = data.records;
        const types = data.types;
        const fields = data.viewParams.fields;
        $scope.title = data.viewParams.tableLabel;
        
        const header = [];
        for(var i = 0; i < showFields.length; i++) {
            const field = fields[showFields[i]];
            if(!field) {
                console.log('Field not found: ', showFields[i]);
                continue;
            }
            header.push( field.label );
        }
        $scope.header = header;
        
        const showRecords = [];
        for(var i = 0; i < records.length; i++) {
            const recordValues = [];
            const item = {};
            const record = records[i];
            for(var j = 0; j < showFields.length; j++) {
                const gridField = showFields[j];
                var recordValue = record[gridField];
                if(types[gridField] == 'DATE')
                    recordValue = DateService.dateFormat(recordValue);
                recordValues.push(recordValue);
            }
            item.id = record.id;
            // considering always the first column as the link field
            item.linkField = recordValues[0];
            recordValues.splice(0, 1);
            item.recordValues = recordValues;
            showRecords.push(item);
        }
        $scope.records = showRecords;
    }
}


var app = angular.module('FilteredObjectsDirective', []);
app.directive('filteredObjects', function() {
    return {
        restrict: 'E',
        scope: {
            referencedObject: '=ngModel',
            id: '=ngId',
            onError: '=ngOnError'
        },
        controller: ['$scope', 'server', 'DateService', controllerFunc],
       templateUrl: 'app/directives/templates/filtered_objects.html'
    };
});