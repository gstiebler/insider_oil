'use strict';
angular.module('InsiderOilApp').controller('ViewRecordController', 
                ['$scope', 'server', '$routeParams', 'showError', 'Flash', 'DateService',
        function($scope, server, $routeParams, showError, Flash, DateService) {
    
    const source = $routeParams.source;
    const id = $routeParams.id;
    $scope.id = id;
    $scope.source = source;
    
    $scope.relatedPersons = {
        queryName: 'PersonsByProject',
        title: 'Pessoas',
        filters: {
            project_id: id,
            dataSource: source
        }
    }
    
    const relateNewsQuery = {
        queryName: 'NewsByObject',
        title: 'Notícias',
        filters: {
            modelName: source,
            id: id
        }
    }
    server.getQueryData(relateNewsQuery, onNews, showError.show);
    
    function onNews(newsData) {
        $scope.newsData = newsData.records;
    }
    
    
    // show record values
    function showValues(viewData) {
        function formatByType(field) {
            if(field.type == 'DATE') {
                field.value = DateService.dateFormat(field.value);
            } else if(field.type == 'DATETIME') {
                field.value = DateService.parseDateTime(field.value);
            } else {
                return field.value;    
            }                
        }
        
        const record = viewData.record;
        const fieldValues = [];
        for(var i = 0; i < record.length; i++) {
            if(record[i].isMultiFieldText) {
                if(!record[i].value)
                    continue;
                var items = record[i].value.split('\n');
                for(var j = 0; j < items.length; j++) {
                    var newFieldInfo = { type: items[j].type };
                    var parts = items[j].split(':');
                    newFieldInfo.label = parts[0];
                    newFieldInfo.value = parts[1];
                    fieldValues.push(newFieldInfo);   
                }
            } else {
                record[i].value = formatByType(record[i]);
                fieldValues.push(record[i]);   
            }
        }
        $scope.record = fieldValues;
        $scope.referencedObjects = viewData.referencedObjects;
    }
    server.viewRecord( source, id, showValues, showError.show );
}]);