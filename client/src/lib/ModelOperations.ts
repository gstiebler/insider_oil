import { browserHistory } from 'react-router';
import * as server from './Server';

function createDefaultModelOperations(modelName) {
    var modelOperations = {
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
    var modelOperations = createDefaultModelOperations(modelName);
    
    modelOperations.createItem = function() {
        browserHistory.push("/app/create_news");
    }
    
    modelOperations.editRecord = function(id) {
        $location.path("/app/create_news").search({ id: id });
    }
    
    return modelOperations;
}


export function getModelOperations(modelName) {
    var customModels = {
        'News': createNewsOperations
    }
    
    var constructorFunc = customModels[modelName];
    if(!constructorFunc)
        constructorFunc = createDefaultModelOperations;
    
    return constructorFunc(modelName);
}