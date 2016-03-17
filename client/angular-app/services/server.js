'use strict';
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
    
    /**
     * Return multiple records
     * @param {String} table Name of the datasource
     * @param {} options Opttions (filters and fields)
     * @param {Function} okCallback Result callback
     * @param {Function} errorCallback Error callback
     */
    this.getTable = function( table, options, okCallback, errorCallback ) {
        const params = { 
            table: table,
            filters: options.filters,
            fieldNames: options.fieldNames,
            token: session.getToken()
        };
        
        $http.get('/db_server/', { params: params }).
        then(function(response) {
            okCallback(response.data);
        }, errorCallback);
    }
    
    /**
     * Return multiple records from a query
     * @param {String} dataSource Name of the datasource
     * @param {} options Opttions (queryName and filters)
     * @param {Function} okCallback Result callback
     * @param {Function} errorCallback Error callback
     */
    this.getQueryData = function( dataSource, options, okCallback, errorCallback ) {
        const params = { 
            dataSource: dataSource,
            queryName: options.queryName,
            filters: options.filters,
            token: session.getToken()
        };
        
        $http.get('/get_query_data', { params: params }).
        then(function(response) {
            okCallback(response.data);
        }, errorCallback);
    }
    
    
    this.getModelFields = function( model, okCallback, errorCallback ) {
        const params = { 
            model: model,
            token: session.getToken()
        };
        
        $http.get('/model_fields/', { params: params }).
        then(function(response) {
            okCallback(response.data.fields);
        }, errorCallback);
    }
    
    
    this.createNewItem = function( modelName, newItemData, onSave, onError ) {
        const params = {
            model: modelName,
            newItemData: newItemData,
            token: session.getToken()
        };
        
        $http.post('/create_item/', params ).then(onSave, onError);
    }
    
    
    this.deleteItem = function( modelName, id, onDelete, onError ) {
        const params = {
            model: modelName,
            id: id,
            token: session.getToken()
        };
        
        $http.delete('/delete_item/', { params: params }).then(onDelete, onError);
    }
    
   
    this.getModelFieldsAndValues = function( modelName, id, okCallback, errorCallback ) {
        const params = { 
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
        const params = {
            model: modelName,
            record: record,
            token: session.getToken()
        };
        
        $http.put('/save_item/', params ).then(onSave, onError);
    }
    
    
    this.getComboValues = function(modelName, okCallback, onError) {
        const params = { model: modelName };
        http(params, $http.get, '/combo_values/', okCallback, onError);
    }
    
    
    this.getTree = function(okCallback, onError) {
        http({}, $http.get, '/tree/', okCallback, onError);
    }
    
    
    this.getSearchResult = function(searchValue, okCallback, onError) {
    	const params = { searchValue: searchValue };
        http(params, $http.get, '/search', okCallback, onError);
    }
    
    
    this.viewRecord = function(dataSource, id, okCallback, onError) {
        const params = { 
            dataSource: dataSource,
            id: id
        };
        http(params, $http.get, '/view_record/', okCallback, onError);
    }
    
    
    this.sourceList = function(onData, onError) {
        http({}, $http.get, '/sources_list/', onData, onError);
    }
    
    
    this.allNews = function(onData, onError) {
        http({}, $http.get, '/news', onData, onError);
    }
    
    
    this.newsFromObject = function(sourceName, id, onData, onError) {
    	const params = {
    		sourceName: sourceName,
    		id: id
    	};
        http(params, $http.get, '/news/from_object', onData, onError);
    }
    
    
    this.changePassword = function(onData, onError, oldPassword, newPassword) {
    	const params = {
    		oldPassword: oldPassword,
    		newPassword: newPassword	
    	};
        http(params, $http.put, '/user/change_password', onData, onError);
    }
    
    
    this.downloadExcelFile = function(dataSource, onData, onError) {
    	const params = {
    		dataSource: dataSource	
    	};
        http(params, $http.get, '/download_excel', onData, onError);
    }
        
}]);