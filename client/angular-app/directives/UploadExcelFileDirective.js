'use strict';

/*****************
Directive to upload Excel File
******************/

var app = angular.module('UploadExcelFileDirective', []);

function uploadExcelFileController($scope, ModelOperations) {
    
    function uploadFiles(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if(!file)
            return;
            
        ModelViewService.uploadFile(file, $scope.modelName, $scope.onFileUploaded);
    }
        
    $scope.uploadFiles = uploadFiles;
}

app.directive('uploadExcelFile', function() {
    return {
        restrict: 'E',
        scope: {
            modelName: '=modelName',
            onFileUploaded: '=onFileUploaded'
        },
        controller: ['$scope','ModelOperations', uploadExcelFileController],
        templateUrl: 'app/directives/templates/upload_excel_file.html'
    };
});