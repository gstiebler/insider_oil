angular.module('ModelViewCtrl', ['ngFileUpload']).controller('ModelViewController', 
                ['$scope', 'server', '$routeParams', '$location', 'Upload', '$timeout',
        function($scope, server, $routeParams, $location, Upload, $timeout) {

    var modelName = $routeParams.model;
    server.getTable(modelName, showModel, showError );
    
    function showModel(model) {
        $scope.viewParams = model.viewParams;
        $scope.records = model.records;
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
}]);