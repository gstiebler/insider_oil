 var app = angular.module('InsiderOilApp');

app.service('ModelOperations', ['$location', 'server',
               function($location, server) {

    function createDefaultModelOperations(modelName) {
    	const modelOperations = {
    		editRecord: function(id) {
    	        $location.path("/app/edit_item").search({ modelName: modelName, id: id });
    		},
    		createItem: function() {
    			$location.path("/app/create_item").search({ model: modelName });
    		},
    		deleteItem: function(id, onDelete, onError) {
                server.deleteItem( modelName, id, onDelete, onError );
    		}
    	};
    	
    	return modelOperations;
    }
    
    
    function createNewsOperations(modelName) {
    	const modelOperations = createDefaultModelOperations(modelName);
    	modelOperations.createItem = function() {
			$location.path("/app/create_news");
    	}
    	return modelOperations;
    }
    
    
    function createPersonOperations(modelName) {
    	const modelOperations = createDefaultModelOperations(modelName);
    	modelOperations.editRecord = function(id) {
			$location.path("/app/edit_person").search({ id: id });
    	}
    	return modelOperations;
    }
    
    
    this.getModelOperations = function(modelName) {
    	const customModels = {
    		'News': createNewsOperations,
    		'Person': createPersonOperations
    	}
    	
    	var constructorFunc = customModels[modelName];
    	if(!constructorFunc)
    		constructorFunc = createDefaultModelOperations;
    	
    	return constructorFunc(modelName);
    }
    
}]);