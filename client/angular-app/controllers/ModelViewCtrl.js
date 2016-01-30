'use strict';
angular.module('InsiderOilApp').controller('ModelViewController', 
                ['$scope', 'server', '$routeParams', '$location', 'showError', 'Flash', 'ModelOperations', 'ModelViewService',
        function($scope, server, $routeParams, $location, showError, Flash, ModelOperations, ModelViewService) {

    var modelName = $routeParams.model;
    server.getTable(modelName, {}, showModel, showError.show );
    
    var datatableInitialized = false;
    const dataTableElement = $('#mainTable');
    const modelOperations = ModelOperations.getModelOperations(modelName);
    
    function dateFormat(dateStr) {
        if(!dateStr)
            return '';
        const strParts = dateStr.substring(0, 10).split('-');;
        return strParts[2] + '/' + strParts[1] + '/' + strParts[0];
    }

    function showModel(modelData) {
    	if(modelData.records.length == 0) return;
    	
        if(!datatableInitialized) {
            $scope.viewParams = modelData.viewParams;
            var columns = [];
            for( var i = 0; i < modelData.viewParams.gridFields.length; i++) {
                var fieldName = modelData.viewParams.gridFields[i];
                if(fieldName == 'id') continue;
                var fieldLabel = modelData.viewParams.fields[fieldName].label;
                var columnObj = { 
                    title: fieldLabel,
                    data: fieldName
                };
                if(modelData.types[fieldName] == "DATE")
                    columnObj.render = { display: dateFormat };
                    
                columns.push(columnObj);
            }
            
            columns.push( { title: "Editar", data: 'edit' } );
            columns.push( { title: "Apagar", data: 'delete' } );
            
            dataTableElement.DataTable( {
                columns: columns,
                language: ModelViewService.datatablesPtBrTranslation
            } );
            datatableInitialized = true;
        }
        
        var dataSet = [];
        for( var i = 0; i < modelData.records.length; i++) {
            var record = modelData.records[i];
            var prelude = "angular.element(document.getElementById('angularContainer')).scope().";
            var editFuncStr = prelude + "editRecord(" + record.id + ")";
            var deleteFuncStr = prelude + "deleteRecord(" + record.id + ")";
            record.edit = '<a class="btn btn-large btn-primary" onclick="' + editFuncStr + '")">Editar</a>';
            record.delete = '<button class="btn btn-large btn-danger" onclick="' + deleteFuncStr + '">Apagar</button>';
            dataSet.push(record);
        }
        
        var oTable = dataTableElement.dataTable();
        oTable.fnClearTable();
        oTable.fnAddData( dataSet );
    }
    
    $scope.editRecord = function(id) {
    	modelOperations.editRecord(id);
        // I don't know why the line below should be here for the redirect to work
        server.getTable(modelName, {}, showModel, showError.show ); 
    }
    
    $scope.deleteRecord = function(id) {
        if(confirm("Deseja realmente apagar o registro?")){
        	modelOperations.deleteItem(id, onDelete, showError.show);
        }
    }
    
    $scope.createItem = modelOperations.createItem;
    
    function onDelete(status) {
        Flash.create('success', status.data.msg );
        server.getTable(modelName, {}, showModel, showError.show ); 
    }
    
    $scope.showMap = function() {
         $location.path("/app/map").search({ model: modelName });
    }
    
    $scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
        	ModelViewService.uploadFile(file, modelName, showModel);
        }   
    }
    
}]);