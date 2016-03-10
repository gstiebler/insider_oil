'use strict';
var app = angular.module('InsiderOilApp');

app.service('ModelViewService', ['server','Flash', 'Upload', '$timeout', 'showError', 
               function(server, Flash, Upload, $timeout, showError) {

    this.datatablesPtBrTranslation = {
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
    }
    
    
    this.uploadFile = function(file, modelName, showModelCallback) {
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
                server.getTable(modelName, {}, showModelCallback, showError.show );  
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
    
}]);