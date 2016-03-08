'use strict';
angular.module('InsiderOilApp').controller('EditNewsController', 
                ['$scope', '$http', '$routeParams', '$location', 'server', 'session', 'showError', 'Flash',
        function($scope, $http, $routeParams, $location, server, session, showError, Flash) {
                	
    const modelName = 'News';
    const id = $routeParams.id;
    
    if(id) {
        $scope.mainTitle = "Editar notícia"
        
        server.getModelFieldsAndValues(modelName, id, valuesArrived, showError.show);
        
        function valuesArrived(data) {
            $scope.title = data.values.title;
            $scope.content = data.values.content;
        }
    } else {
        $scope.mainTitle = "Nova notícia"
    }
                	
	$scope.saveItem = function() {
		function onUserDataArrived(userData) {
			const itemData = {};
			itemData.title = $scope.title;
			itemData.content = $scope.content;
			itemData.author_id = userData.data.id;
            if(id) {
                itemData.id = id;
                server.saveItem( modelName, itemData, onSave, showError.show );
            } else {
		        server.createNewItem( modelName, itemData, onSave, showError.show );
            }
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
    
    
    function insertLinkInContent(previousContent, linkStr) {
        const symbolPos = previousContent.lastIndexOf('<');
        const beforeSymbolStr = previousContent.slice(0, symbolPos);
        const afterSymboStr = previousContent.slice(symbolPos, previousContent.length);
        return beforeSymbolStr + linkStr + afterSymboStr;
    }

    
    $scope.showError = showError.show;
    $scope.onProjectSelected = function(selectedItem) {
    	const linkStr = '<a href="/app/view_record?source=' + selectedItem.model + '&id=' + selectedItem.id + '">' + selectedItem.name + '</a>';
    	$scope.content = insertLinkInContent($scope.content, linkStr);
    }
                	
}]);