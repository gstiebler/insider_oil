 var app = angular.module('InsiderOilApp');

app.service('server', ['$http', 
               function($http) {
    
    this.getTable = function( table, okCallback, errorCallback ) {
        params = { 
            table: table
        };
        
        $http.get('/db_server/', { params: params }).
        then(function(response) {
            okCallback(response.data);
        }, function(response) {
            errorCallback(response);
        });
    }
        
}]);