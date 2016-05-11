'use strict';
var app = angular.module('InsiderOilApp');

app.service('ModelViewService', ['server','Flash', 'Upload', '$timeout', 'DateService',
               function(server, Flash, Upload, $timeout, DateService) {

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
    
    
    function formatExcelUploadResult(response) {
        var statusStr = response.status.replace(/\n/g, '<br>');
        if(response.recordsStatus) {
            for( var i = 0; i < response.recordsStatus.length; i++ ) {
                statusStr += '<br>' + response.recordsStatus[i];
            }
        }       
        return statusStr;
    }
    
    
    function uploadFile(file, modelName, doneCallback) {
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
                var statusStr = formatExcelUploadResult(response.data);
                doneCallback(statusStr);
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
    
    
    function getColumns(viewParams, types) {
        var columns = [];
        for( var i = 0; i < viewParams.gridFields.length; i++) {
            var fieldName = viewParams.gridFields[i];
            if(fieldName == 'id') continue;
            var fieldLabel = viewParams.fields[fieldName].label;
            var columnObj = { 
                title: fieldLabel,
                data: fieldName
            };
            if(types[fieldName] == "DATE")
                columnObj.render = { display: DateService.dateFormat };
                
            columns.push(columnObj);
        }        
        return columns;
    }
    
    
    this.uploadFile = uploadFile;
    this.getColumns = getColumns;
    this.formatExcelUploadResult = formatExcelUploadResult;
    
}]);