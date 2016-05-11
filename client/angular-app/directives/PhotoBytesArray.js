'use strict';
var app = angular.module('PhotoBytesArray', []);

function _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}


function base64ToArray( base64 ) {
    var base64str = atob(base64);
    var bytes = new Array( base64str.length );
    for(var i = 0; i < base64str.length; i++) {
        bytes[i] = base64str.charCodeAt(i);
    }
    return bytes;
}


app.directive('photoBytesArray', function() {
    return {
        restrict: 'E',
        scope: {
            dsBytesArray: '=dsBytesArray'
        },
        controller: ['$scope', function($scope) { 
            var contentType = 'image/JPEG';
            var base64Header = 'data:' + contentType + ';base64,';
            
            $scope.loadPhoto = function($fileContent){
                var dsBase64 = $fileContent;
                $scope.photoBase64 = dsBase64;
                var trimmedBase64 = dsBase64.substring(dsBase64.search(';base64,') + 8, dsBase64.length);
                $scope.dsBytesArray = base64ToArray(trimmedBase64);
            };

            $scope.$watch('dsBytesArray', function(newValue, oldValue){
                if(!newValue)
                    return;
                    
                $scope.photoBase64 = base64Header + _arrayBufferToBase64( newValue );
            });    
        }],
        template: '<img ng-src="{{photoBase64}}" alt="Foto">\
                   <input type="file" on-read-file="loadPhoto($fileContent)" />'
    };
});