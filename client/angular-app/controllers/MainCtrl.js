'use strict';
angular.module('InsiderOilApp').controller('MainController', 
        ['$scope', '$location', '$http', 'session', 'server', 'showError',  
         function($scope, $location, $http, session, server, showError) {

    var token = $location.search().token;
    if( token )
        session.login( token );
    else
        token = session.getToken();    
    
    var url = $location.search().url;
    if( url ) {
        var decodedURL = decodeURIComponent(url);
        $location.url(decodedURL);
    }
    
    $http.get('/user/details', { params: { token: token} }).
            then(function(response) {
                $scope.username = response.data.login;
            }, function(response) {
                showError.show( "Problemas na resposta: " + response.data.errorMsg );
            });
            
            
    $scope.logout = session.logout; // functions
    
    $scope.showError = showError.show;
    $scope.onProjectSelected = function(selectedItem) {
    	const searchParams = {
    		source: selectedItem.model,
    		id: selectedItem.id
    	};
        $location.path("/app/view_record").search(searchParams);
    }
    
} ] );