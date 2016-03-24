'use strict';
var app = angular.module('InsiderOilApp');

app.service('session', ['$http', '$location', '$cookies', '$window', 'showError',
               function($http, $location, $cookies, $window, showError ) {
    
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
            showError.show( "Error on logout: " + response );
        }
    };
    
    this.getToken = function() {
        return $cookies.get('token');
    }
    
}]);