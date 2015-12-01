 var app = angular.module('InsiderOilApp');

app.service('server', ['$http', 
               function($http) {
    
    this.getTable = function( table, okCallback, errorCallback ) {
        params = { 
            table: table
        };
        
        $http.get('/db_server/', { params: params }).
        then(function(response) {
            okCallback(response.data);
        }, errorCallback);
    }
    
    
    this.getModelFields = function( model, okCallback, errorCallback ) {
        params = { 
            model: model
        };
        
        $http.get('/model_fields/', { params: params }).
        then(function(response) {
            okCallback(response.data.fields);
        }, errorCallback);
    }
    
    
    this.createNewItem = function( modelName, newItemData, onSave, onError ) {
        params = {
            model: modelName,
            newItemData: newItemData
        };
        
        $http.post('/create_item/', { params: params }).then(onSave, onError);
    }
    
    
    this.deleteItem = function( modelName, id, onDelete, onError ) {
        params = {
            model: modelName,
            id: id
        };
        
        $http.delete('/delete_item/', { params: params }).then(onDelete, onError);
    }
    
   
    this.getModelFieldsAndValues = function( modelName, id, okCallback, errorCallback ) {
        params = { 
            model: modelName,
            id: id
        };
        
        $http.get('/record_values/', { params: params }).
        then(function(response) {
            okCallback(response.data);
        }, errorCallback);
    }
    
    
    this.saveItem = function( modelName, record, onSave, onError ) {
        params = {
            model: modelName,
            record: record
        };
        
        $http.delete('/save_item/', { params: params }).then(onDelete, onError);
    }
        
}]);