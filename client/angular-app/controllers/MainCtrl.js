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
                console.log( "Problemas na resposta: " + response.data.errorMsg );
            });
            
            
    $scope.logout = session.logout; // functions
    
    var searchResult = {};
    $scope.onSearchType = function(value) {
    	function onSearchResult(results) {
    		$scope.searchOptions = [];
			searchResult = {};
    		for(var i = 0; i < results.length; i++) {
    			$scope.searchOptions.push(results[i].name);
    			searchResult[results[i].name] = {
    				model: results[i].model,
    				id: results[i].id
    			};
    		}
    	}
    	server.getSearchResult(value, onSearchResult, showError.show);
    }
    
    $scope.onSelect = function(value) {
    	const selectedItem = searchResult[value];
    	const searchParams = {
    		source: selectedItem.model,
    		id: selectedItem.id
    	};
        $location.path("/app/view_record").search(searchParams);
    }
    
} ] );