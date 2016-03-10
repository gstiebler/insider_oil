'use strict';
var app = angular.module('InsiderOilApp');

app.service('session', ['$http', '$location', '$cookies', '$window',
               function($http, $location, $cookies, $window ) {
    
    this.login = function(token) {
        $cookies.put( 'token', token );
    }
    
    this.logout = function() {
        var token = $cookies.get('token');
        // TODO change to /session/logout
        $http.put('/login/logout', { params: { token: token } }).then(logoutOk, logoutError);
        
        function logoutOk(response) {        
            $cookies.put( 'token', '' );
            $window.location.href = '/';
            //$location.path("/");
        }
        
        function logoutError(response) {
            console.log( "Error on logout: " + response );
        }
    };
    
    this.getToken = function() {
        return $cookies.get('token');
    }
    
}]);