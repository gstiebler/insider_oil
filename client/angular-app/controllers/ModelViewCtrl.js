angular.module('ModelViewCtrl', ['ngFileUpload', 'flash']).controller('ModelViewController', 
                ['$scope', 'server', '$routeParams', '$location', 'Upload', '$timeout', 'showError', 'Flash',
        function($scope, server, $routeParams, $location, Upload, $timeout, showError, Flash) {

    var modelName = $routeParams.model;
    server.getTable(modelName, showModel, showError.show );
    
    var datatableInitialized = false;
    var dataTableElement = $('#mainTable');
    
    var datatables_pt_br_translation = {
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

    function showModel(model) {
    
        if(!datatableInitialized) {
            
            var columns = [];
            for( var i = 0; i < model.viewParams.gridFields.length; i++) {
                var fieldName = model.viewParams.gridFields[i];
                if(fieldName == 'id') continue;
                var fieldLabel = model.viewParams.fields[fieldName].label;
                columns.push({ 
                    title: fieldLabel
                });
            }
            
            columns.push( { title: "Editar" } );
            columns.push( { title: "Apagar" } );
            
            dataTableElement.DataTable( {
                columns: columns,
                language: datatables_pt_br_translation
            } );
            datatableInitialized = true;
        }
        
        var dataSet = [];
        for( var i = 0; i < model.records.length; i++) {
            var record = model.records[i];
            var recordItem = [];
            for( var j = 0; j < model.viewParams.gridFields.length; j++) {
                var fieldName = model.viewParams.gridFields[j];
                if(fieldName == 'id') continue;
                recordItem.push( record[fieldName] );
            }
            var prelude = "angular.element(document.getElementById('angularContainer')).scope().";
            var editFuncStr = prelude + "editRecord(" + record.id + ")";
            var deleteFuncStr = prelude + "deleteRecord(" + record.id + ")";
            recordItem.push('<a class="btn btn-large btn-primary" onclick="' + editFuncStr + '")">Editar</a>');
            recordItem.push('<button class="btn btn-large btn-danger" onclick="' + deleteFuncStr + '">Apagar</button>');
            dataSet.push(recordItem);
        }
        
        var oTable = dataTableElement.dataTable();
        oTable.fnClearTable();
        oTable.fnAddData( dataSet );
    }
    
    $scope.editRecord = function(id) {
        $location.path("/app/edit_item").search({ modelName: modelName, id: id });
        // I don't know why the line below should be here for the redirect to work
        server.getTable(modelName, showModel, showError.show ); 
    }
    
    $scope.deleteRecord = function(id) {
        if(confirm("Deseja realmente apagar o registro?")){
            function onDelete() {
                server.getTable(modelName, showModel, showError.show ); 
            }
            
            server.deleteItem( modelName, id, onDelete, showError.show );
        }
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
                    Flash.create('success', response.data.status.replace(/\n/g, '<br>'));
                    server.getTable(modelName, showModel, showError.show );  
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
    
    $scope.createItem = function() {
         $location.path("/app/create_item").search({ model: modelName });
    }
    
}]);