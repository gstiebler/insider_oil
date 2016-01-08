'use strict';
angular.module('EditNewsCtrl', ['flash', 'ui.bootstrap']).controller('EditNewsController', 
                ['$scope', '$http', '$routeParams', '$location', 'server', 'session', 'showError', 'Flash',
        function($scope, $http, $routeParams, $location, server, session, showError, Flash) {
                	
    const modelName = 'News';
                	
	$scope.saveItem = function() {
		function onUserDataArrived(userData) {
			console.log(userData);
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
                	
}]);