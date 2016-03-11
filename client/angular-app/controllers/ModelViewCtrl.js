'use strict';
angular.module('InsiderOilApp').controller('ModelViewController', 
                ['$scope', 'server', '$routeParams', '$location', 'showError', 'Flash', 
                 'ModelOperations', 'ModelViewService', 'DateService',
        function($scope, server, $routeParams, $location, showError, Flash, 
                 ModelOperations, ModelViewService, DateService) {

    var modelName = $routeParams.model;
    $scope.dataSource = modelName;
    server.getTable(modelName, {}, showModel, showError.show );
    
    var datatableInitialized = false;
    const dataTableElement = $('#mainTable');
    const modelOperations = ModelOperations.getModelOperations(modelName);

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
                    columnObj.render = { display: DateService.dateFormat };
                    
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
        if(!file)
            return;
            
        ModelViewService.uploadFile(file, modelName, fileUploaded);
        
        function fileUploaded(status) {
            Flash.create('success', status );
            server.getTable(modelName, {}, showModel, showError.show );
        }
    }
    
    function str2ab(str) {
    	  var buf = new ArrayBuffer(str.length);
    	  var bufView = new Uint8Array(buf);
    	  for (var i=0, strLen=str.length; i<strLen; i++) {
    	    bufView[i] = str.charCodeAt(i);
    	  }
    	  return buf;
    }
    
    $scope.getExcelFile = function() {
    	server.downloadExcelFile(modelName, onExcelFile, showError.show);
    	
    	function onExcelFile(xlsxBinary) {
    		const ba = str2ab(xlsxBinary);
    		var blob = new Blob([ba], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    		saveAs(blob, "arquivo.xlsx");
    	}
    }
    
}]);