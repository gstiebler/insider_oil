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

    
    $scope.showError = showError.show;
    $scope.onProjectSelected = function(selectedItem) {
    	const linkStr = '<a href="/app/view_record?source=' + selectedItem.model + '&id=' + selectedItem.id + '">' + selectedItem.name + '</a>';
    	$scope.content += linkStr;
    }
                	
}]);