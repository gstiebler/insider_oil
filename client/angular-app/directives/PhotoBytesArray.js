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
    const base64str = atob(base64);
    const bytes = new Array( base64str.length );
    for(var i = 0; i < base64str.length; i++) {
        bytes[i] = base64str.charCodeAt(i);
    }
    return bytes;
}


app.directive('photoBytesArray', function() {
    return {
        restrict: 'E',
        scope: {
            dsBytesArray: '=dsBytesArray',
            dsBase64: '=dsBase64'
        },
        controller: ['$scope', function($scope) { 
            const contentType = 'image/JPEG';
            const base64Header = 'data:' + contentType + ';base64,';

            $scope.$watch('dsBytesArray', function(newValue){
                if(!newValue)
                    return;
                $scope.photoBase64 = base64Header + _arrayBufferToBase64( newValue );
            });    
            
            $scope.$watch('dsBase64', function(newValue){
                if(!newValue)
                    return;
                $scope.photoBase64 = newValue;
                const trimmedBase64 = newValue.substring(newValue.search(';base64,') + 8, newValue.length);
                $scope.dsBytesArray = base64ToArray(trimmedBase64);
                //$scope.$apply();
            });
        }],
        template: '<img ng-src="{{photoBase64}}" alt="Foto">'
    };
});