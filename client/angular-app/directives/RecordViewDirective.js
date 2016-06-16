'use strict';

var app = angular.module('RecordViewDirective', []);

var _DateService;
var _$rv_scope;

function strContains(input, substr) {
    return input.indexOf(substr) > -1;
}

function formatByType(field) {
    if(field.type == 'DATE') {
        return _DateService.dateFormat(field.value);
    } else if(field.type == 'DATETIME') {
        return _DateService.dateTimeFormat(field.value);
    } else if (field.isCurrency) {
        return _ModelViewService.formatCurrency(field.value);
    }   else {
        return field.value;    
    }              
}

function onRecordDataChange(recordData) {
    if(!recordData)
        return;
    var fieldValues = [];
    for(var i = 0; i < recordData.length; i++) {
        if(!recordData[i].value || 
                strContains(recordData[i].label, 'ignorar') || 
                strContains(recordData[i].label, 'admin')) {
            continue;
        }
        if(recordData[i].isMultiFieldText) {
            var items = recordData[i].value.split('\n');
            for(var j = 0; j < items.length; j++) {
                var newFieldInfo = { type: items[j].type };
                var parts = items[j].split(':');
                newFieldInfo.label = parts[0];
                newFieldInfo.value = parts[1];

                if(!newFieldInfo.value || 
                        strContains(newFieldInfo.label, 'ignorar') ||
                        strContains(newFieldInfo.label, 'admin')) {
                    continue;
                }
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
            recordData: '=recordData',
            source: '=source',
            id: '=ngId'
        },
        controller:['$scope', 'DateService', 'ModelViewService', 
                    function($scope, DateService, ModelViewService) {
            _DateService = DateService;
            _ModelViewService = ModelViewService;
            _$rv_scope = $scope;
            $scope.$watch('recordData', onRecordDataChange);
        }],
        templateUrl: 'app/directives/templates/record_view.html'
    };
});