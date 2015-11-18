angular.module('MainCtrl', []).controller('MainController', 
        ['$scope', '$routeParams', '$location', '$http',  
         function($scope, $routeParams, $location, $http) {

	$scope.tagline = 'To the moon and back!';

    var token = $location.search().token;
    console.log( "token: " + token );
    var url = $location.search().url;
    if( url ) {
        console.log( "url: " + decodedURL );
        var decodedURL = decodeURIComponent(url);
        $location.url(decodedURL);
    }
    
    $http.get('/user/details', { params: { token: token} }).
            then(function(response) {
                console.log( "user details: "  + JSON.stringify(response.data) );
                $scope.username = response.data.login;
            }, function(response) {
                console.log( "Problemas na resposta: " + response.data.errorMsg );
            });

} ] );