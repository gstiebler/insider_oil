'use strict';

var app = angular.module('RecordViewDirective', []);

var _DateService;
var _$rv_scope;

function formatByType(field) {
    if(field.type == 'DATE') {
        return _DateService.dateFormat(field.value);
    } else if(field.type == 'DATETIME') {
        return _DateService.dateTimeFormat(field.value);
    } else {
        return field.value;    
    }                
}

function onRecordDataChange(recordData) {
    if(!recordData)
        return;
    var fieldValues = [];
    for(var i = 0; i < recordData.length; i++) {
        if(recordData[i].isMultiFieldText) {
            if(!recordData[i].value)
                continue;
            var items = recordData[i].value.split('\n');
            for(var j = 0; j < items.length; j++) {
                var newFieldInfo = { type: items[j].type };
                var parts = items[j].split(':');
                newFieldInfo.label = parts[0];
                newFieldInfo.value = parts[1];
                fieldValues.push(newFieldInfo);   
            }
        } else {
            recordData[i].value = formatByType(recordData[i]);
            fieldValues.push(recordData[i]);   
        }
    }
    _$rv_scope.record = fieldValues;
}

app.directive('recordView', function() {
    return {
        restrict: 'E',
        scope: {
            recordData: '=recordData'
        },
        controller:['$scope', 'DateService', function($scope, DateService) {
            _DateService = DateService;
            _$rv_scope = $scope;
            $scope.$watch('recordData', onRecordDataChange);
        }],
        templateUrl: 'app/directives/templates/record_view.html'
    };
});