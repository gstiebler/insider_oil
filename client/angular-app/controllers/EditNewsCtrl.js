'use strict';
angular.module('InsiderOilApp').controller('EditNewsController', 
                ['$scope', '$http', '$routeParams', '$location', 'server', 'session', 'showError', 'Flash',
        function($scope, $http, $routeParams, $location, server, session, showError, Flash) {
                	
    const modelName = 'News';
                	
	$scope.saveItem = function() {
		function onUserDataArrived(userData) {
			const itemData = {};
			itemData.title = $scope.title;
			itemData.content = $scope.content;
			itemData.author_id = userData.data.id;
		    server.createNewItem( modelName, itemData, onSave, showError.show );
		}
	    
	    $http.get('/user/details', { params: { token: session.getToken()} }).
        	then(onUserDataArrived, showError.show);
	}
	
	function onSave(status) {
	    Flash.create('success', status.data.msg);
	    $location.path("/app/model_view").search({ model: modelName });
	}      
	
	$scope.printHtml = function() {
		console.log($scope.content);
	}
	
	// search box code
    var searchResult = {};
    $scope.onSearchType = function(value) {
    	function onSearchResult(results) {
    		$scope.searchOptions = [];
			searchResult = {};
    		for(var i = 0; i < results.length; i++) {
    			const completeSearchKey = results[i].modelLabel + ': ' +results[i].name;
    			$scope.searchOptions.push(completeSearchKey);
    			searchResult[completeSearchKey] = {
    				model: results[i].model,
    				id: results[i].id,
    				name: results[i].name
    			};
    		}
    	}
    	server.getSearchResult(value, onSearchResult, showError.show);
    }
    
    $scope.onSelectItemOnSearchBox = function(value) {
    	const selectedItem = searchResult[value];
    	const searchParams = {
    		source: selectedItem.model,
    		id: selectedItem.id
    	};
    	const linkStr = '<a href="/app/view_record?source=' + selectedItem.model + '&id=' + selectedItem.id + '">' + selectedItem.name + '</a>';
    	$scope.content += linkStr;
    }
                	
}]);