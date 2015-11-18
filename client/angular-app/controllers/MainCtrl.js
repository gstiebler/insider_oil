angular.module('MainCtrl', []).controller('MainController', 
        ['$scope', '$routeParams', '$location', '$http', 'session', 
         function($scope, $routeParams, $location, $http, session) {

	$scope.tagline = 'To the moon and back!';

    var token = $location.search().token;
    if( token )
        session.login( token );
    else
        token = session.getToken();    
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
            
            
    $scope.logout = session.logout; // functions

} ] );