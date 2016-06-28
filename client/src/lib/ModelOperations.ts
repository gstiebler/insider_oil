import { browserHistory } from 'react-router';
import * as server from './Server';

// TODO use polymorphism. Typescript!
function createDefaultModelOperations(modelName) {
    var modelOperations = {
        editRecord: function(id) {
            var queryStr = "/app/edit_item?modelName=" + modelName + '&id=' + id;
            browserHistory.push(queryStr);
        },
        createItem: function() {
            var queryStr = "/app/create_item?modelName=" + modelName;
            browserHistory.push(queryStr);
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
        var queryStr = "/app/create_news?id=" + id;
        browserHistory.push(queryStr);
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