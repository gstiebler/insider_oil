'use strict';
angular.module('InsiderOilApp').controller('MainController', 
        ['$scope', '$location', 'session', 'server', 'showError',  
         function($scope, $location, session, server, showError) {

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
    
    server.getUserDetails(function(response) {
        console.log(response);
        $scope.username = response.login;
        $scope.isAdmin = response.admin;
    }, showError.show);       
            
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