angular.module('ModelViewCtrl', ['ngFileUpload']).controller('ModelViewController', 
                ['$scope', 'server', '$routeParams', '$location', 'Upload', '$timeout',
        function($scope, server, $routeParams, $location, Upload, $timeout) {

    var modelName = $routeParams.model;
    server.getTable(modelName, showModel, showError );
    
    function showModel(model) {
        var columns = [];
        for( var i = 0; i < model.viewParams.gridFields.length; i++) {
            var field = model.viewParams.gridFields[i];
            columns.push( { title: field } );
        }
        
        var dataSet = [];
        for( var i = 0; i < model.records.length; i++) {
            var record = model.records[i];
            var recordItem = [];
            for( var j = 0; j < columns.length; j++) {
                recordItem.push( record[columns[j].title] );
            }
            dataSet.push(recordItem);
        }
        
        var mainTable = $('#mainTable');
        mainTable.DataTable( {
            data: dataSet,
            columns: columns
        } );
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