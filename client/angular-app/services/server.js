 var app = angular.module('InsiderOilApp');

app.service('server', ['$http', 'session',
               function($http, session) {
    
    function http(params, httpFunc, path, okCallback, onError) {
        params.token = session.getToken();
        
        httpFunc(path, { params: params }).
        then(function(response) {
            okCallback(response.data);
        }, onError);
    }
    
    this.getTable = function( table, filters, okCallback, errorCallback ) {
        params = { 
            table: table,
            filters: filters,
            token: session.getToken()
        };
        
        $http.get('/db_server/', { params: params }).
        then(function(response) {
            okCallback(response.data);
        }, errorCallback);
    }
    
    
    this.getModelFields = function( model, okCallback, errorCallback ) {
        params = { 
            model: model,
            token: session.getToken()
        };
        
        $http.get('/model_fields/', { params: params }).
        then(function(response) {
            okCallback(response.data.fields);
        }, errorCallback);
    }
    
    
    this.createNewItem = function( modelName, newItemData, onSave, onError ) {
        params = {
            model: modelName,
            newItemData: newItemData,
            token: session.getToken()
        };
        
        $http.post('/create_item/', params ).then(onSave, onError);
    }
    
    
    this.deleteItem = function( modelName, id, onDelete, onError ) {
        params = {
            model: modelName,
            id: id,
            token: session.getToken()
        };
        
        $http.delete('/delete_item/', { params: params }).then(onDelete, onError);
    }
    
   
    this.getModelFieldsAndValues = function( modelName, id, okCallback, errorCallback ) {
        params = { 
            model: modelName,
            id: id,
            token: session.getToken()
        };
        
        $http.get('/record_values/', { params: params }).
        then(function(response) {
            okCallback(response.data);
        }, errorCallback);
    }
    
    
    this.saveItem = function( modelName, record, onSave, onError ) {
        params = {
            model: modelName,
            record: record,
            token: session.getToken()
        };
        
        $http.put('/save_item/', params ).then(onSave, onError);
    }
    
    
    this.getComboValues = function(modelName, okCallback, onError) {
        params = { model: modelName };
        http(params, $http.get, '/combo_values/', okCallback, onError);
    }
    
    
    this.getTree = function(okCallback, onError) {
        http({}, $http.get, '/tree/', okCallback, onError);
    }
    
    
    this.getSearchResult = function(searchValue, okCallback, onError) {
    	params = { searchValue: searchValue };
        http(params, $http.get, '/search', okCallback, onError);
    }
    
    
    this.viewRecord = function(dataSource, id, okCallback, onError) {
        params = { 
            dataSource: dataSource,
            id: id
        };
        http(params, $http.get, '/view_record/', okCallback, onError);
    }
    
    
    this.sourceList = function(onData, onError) {
        http({}, $http.get, '/sources_list/', onData, onError);
    }
        
}]);