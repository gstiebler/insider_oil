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
    
    
    function createNewsOperations() {
    	return createDefaultModelOperations();
    }
    
    
    this.getModelOperations = function(modelName) {
    	const customModels = {
    		'news': createNewsOperations
    	}
    	
    	var constructorFunc = customModels[modelName];
    	if(!constructorFunc)
    		constructorFunc = createDefaultModelOperations;
    	
    	return constructorFunc(modelName);
    }
    
}]);