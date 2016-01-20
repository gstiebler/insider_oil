'use strict';
angular.module('ModelViewCtrl', ['ngFileUpload', 'flash']).controller('ModelViewController', 
                ['$scope', 'server', '$routeParams', '$location', 'Upload', '$timeout', 'showError', 'Flash', 'ModelOperations',
        function($scope, server, $routeParams, $location, Upload, $timeout, showError, Flash, ModelOperations) {

    var modelName = $routeParams.model;
    server.getTable(modelName, {}, showModel, showError.show );
    
    var datatableInitialized = false;
    const dataTableElement = $('#mainTable');
    const modelOperations = ModelOperations.getModelOperations(modelName);
    
    const datatables_pt_br_translation = {
        "sEmptyTable": "Nenhum registro encontrado",
        "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
        "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
        "sInfoFiltered": "(Filtrados de _MAX_ registros)",
        "sInfoPostFix": "",
        "sInfoThousands": ".",
        "sLengthMenu": "_MENU_ resultados por página",
        "sLoadingRecords": "Carregando...",
        "sProcessing": "Processando...",
        "sZeroRecords": "Nenhum registro encontrado",
        "sSearch": "Pesquisar",
        "oPaginate": {
            "sNext": "Próximo",
            "sPrevious": "Anterior",
            "sFirst": "Primeiro",
            "sLast": "Último"
        },
        "oAria": {
            "sSortAscending": ": Ordenar colunas de forma ascendente",
            "sSortDescending": ": Ordenar colunas de forma descendente"
        }
    };
    
    function dateFormat(dateStr) {
        if(!dateStr)
            return '';
        const strParts = dateStr.substring(0, 10).split('-');;
        return strParts[2] + '/' + strParts[1] + '/' + strParts[0];
    }

    function showModel(modelData) {
    
    	console.log(modelData);
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
                language: datatables_pt_br_translation
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
            file.upload = Upload.upload({
                url: '/db_server/upload_file',
                data: { file: file },
                params: {
                    table: modelName
                }
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                    console.log(response.data);
                    var statusStr = response.data.status.replace(/\n/g, '<br>');
                    if(response.data.recordsStatus) {
                        for( var i = 0; i < response.data.recordsStatus.length; i++ ) {
                            statusStr += '<br>' + response.data.recordsStatus[i];
                        }
                    }
                    Flash.create('success', statusStr );
                    server.getTable(modelName, {}, showModel, showError.show );  
                });
            }, function (response) {
                if (response.status > 0) {
                    Flash.create('danger', response.data.errorMsg);
                }
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                         evt.loaded / evt.total));
            });
        }   
    }
    
}]);