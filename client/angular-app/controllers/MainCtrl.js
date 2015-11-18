angular.module('MainCtrl', []).controller('MainController', 
        ['$scope', '$routeParams', '$location', '$http',  
         function($scope, $routeParams, $location, $http) {

	$scope.tagline = 'To the moon and back!';

    var token = $location.search().token;
    console.log( "token: " + token );
    
    $http.get('/user/details', { params: { token: token} }).
            then(function(response) {
                console.log( "user details: "  + JSON.stringify(response.data) );
            }, function(response) {
                console.log( "Problemas na resposta: " + response.data.errorMsg );
            });

} ] );