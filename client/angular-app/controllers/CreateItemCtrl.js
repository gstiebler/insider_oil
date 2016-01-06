'use strict';
angular.module('CreateItemCtrl', ['flash', 'ui.bootstrap']).controller('CreateItemController', 
                ['$scope', 'server', '$routeParams', '$location', 'showError', 'Flash',
        function($scope, server, $routeParams, $location, showError, Flash) {
    
    var modelName = $routeParams.model;
    server.getModelFields(modelName, fieldsArrived, showError.show);
    
    $scope.dateFormat = 'dd/MM/yyyy';
    
    $scope.values = {};
    function fieldsArrived(fields) {
        function onValues(values) {
            field.values = values;
        }
        
        for( var i = 0; i < fields.length; i++ ) {
            var field = fields[i];
            $scope.values[field.name] = "";
            field.htmlId = getHtmlId(field);
            field.hasRef = field.type == 'ref';
            field.isDate = field.type == 'DATE';
            if( field.hasRef ) {
                server.getComboValues( field.model, onValues, showError.show );
            }
        }
    
        $scope.fields = fields;
    }
    
    function getHtmlId(field) {
        return "html_id_" + field.name;
    }
    
    $scope.saveItem = function() {
        var itemData = {};
        for( var i = 0; i < $scope.fields.length; i++ )  {
            var field = $scope.fields[i];
            itemData[field.name] = $scope.values[field.name];
        }
            
        server.createNewItem( modelName, itemData, onSave, showError.show );
    }
    
    function onSave(status) {
        Flash.create('success', status.data.msg);
        $location.path("/app/model_view").search({ model: modelName });
    }
        
}]);