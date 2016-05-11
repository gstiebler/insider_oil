'use strict';
angular.module('InsiderOilApp').controller('EditNewsController', 
                ['$scope', '$routeParams', '$location', 'server', 'session', 'showError', 'Flash',
        function($scope, $routeParams, $location, server, session, showError, Flash) {
                	
    var modelName = 'News';
    var id = $routeParams.id;
    
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
			var itemData = {};
			itemData.title = $scope.title;
			itemData.content = $scope.content;
			itemData.author_id = userData.id;
            if(id) {
                itemData.id = id;
                server.saveItem( modelName, itemData, onSave, showError.show );
            } else {
		        server.createNewItem( modelName, itemData, onSave, showError.show );
            }
		}
	    
        server.getUserDetails(onUserDataArrived, showError.show);
	}
	
	function onSave(status) {
	    Flash.create('success', status.data.msg);
	    $location.path("/app/model_view").search({ model: modelName });
	}      
	
	$scope.printHtml = function() {
		console.log($scope.content);
	}
    
    
    function insertLinkInContent(previousContent, linkStr) {
        var symbolPos = previousContent.lastIndexOf('<');
        var beforeSymbolStr = previousContent.slice(0, symbolPos);
        var afterSymboStr = previousContent.slice(symbolPos, previousContent.length);
        return beforeSymbolStr + linkStr + afterSymboStr;
    }

    
    $scope.showError = showError.show;
    $scope.onProjectSelected = function(selectedItem) {
    	var linkStr = '<a href="/app/view_record?source=' + selectedItem.model + '&id=' + selectedItem.id + '">' + selectedItem.name + '</a>';
    	$scope.content = insertLinkInContent($scope.content, linkStr);
    }
                	
}]);