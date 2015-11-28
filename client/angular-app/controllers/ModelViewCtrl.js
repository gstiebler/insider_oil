angular.module('ModelViewCtrl', ['ngFileUpload']).controller('ModelViewController', 
                ['$scope', 'server', '$routeParams', '$location', 'Upload', '$timeout',
        function($scope, server, $routeParams, $location, Upload, $timeout) {

    var modelName = $routeParams.model;
    server.getTable(modelName, showModel, showError );
    
    var datatableInitialized = false;
    var dataTableElement = $('#mainTable');

    function showModel(model) {
    
        if(!datatableInitialized) {
            
            var columns = [];
            for( var i = 0; i < model.viewParams.gridFields.length; i++) {
                var fieldName = model.viewParams.gridFields[i];
                var fieldLabel = model.viewParams.fields[fieldName].label;
                columns.push({ 
                    title: fieldLabel
                });
            }
            
            dataTableElement.DataTable( {
                columns: columns,
                language: {
                    url: "http://cdn.datatables.net/plug-ins/1.10.10/i18n/Portuguese-Brasil.json"
                }
            } );
            datatableInitialized = true;
        }
        
        var dataSet = [];
        for( var i = 0; i < model.records.length; i++) {
            var record = model.records[i];
            var recordItem = [];
            for( var j = 0; j < model.viewParams.gridFields.length; j++) {
                var fieldName = model.viewParams.gridFields[j];
                recordItem.push( record[fieldName] );
            }
            dataSet.push(recordItem);
        }
        
        var oTable = dataTableElement.dataTable();
        oTable.fnClearTable();
        oTable.fnAddData( dataSet );
    }
    
    function showError(error) {
        $scope.error = error;
        console.log('Erros: ' + error);
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
                    $scope.fileUploadStatus = response.data.status;
                    server.getTable(modelName, showModel, showError );  
                });
            }, function (response) {
                if (response.status > 0) {
                    $scope.errorMsg = response.status + ': ' + response.data;
                    console.log(response.data);
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