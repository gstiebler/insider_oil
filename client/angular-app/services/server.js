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
    function getTable( table, options, okCallback, errorCallback ) {
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
    function getQueryData( dataSource, options, okCallback, errorCallback ) {
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
    
    
    function getModelFields( model, okCallback, errorCallback ) {
        const params = { 
            model: model,
            token: session.getToken()
        };
        
        $http.get('/model_fields/', { params: params }).
        then(function(response) {
            okCallback(response.data.fields);
        }, errorCallback);
    }
    
    
    function createNewItem( modelName, newItemData, onSave, onError ) {
        const params = {
            model: modelName,
            newItemData: newItemData,
            token: session.getToken()
        };
        
        $http.post('/create_item/', params ).then(onSave, onError);
    }
    
    
    function deleteItem( modelName, id, onDelete, onError ) {
        const params = {
            model: modelName,
            id: id,
            token: session.getToken()
        };
        
        $http.delete('/delete_item/', { params: params }).then(onDelete, onError);
    }
    
   
    function getModelFieldsAndValues( modelName, id, okCallback, errorCallback ) {
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
    
    
    function saveItem( modelName, record, onSave, onError ) {
        const params = {
            model: modelName,
            record: record,
            token: session.getToken()
        };
        
        $http.put('/save_item/', params ).then(onSave, onError);
    }
    
    
    function getComboValues(modelName, okCallback, onError) {
        const params = { model: modelName };
        http(params, $http.get, '/combo_values/', okCallback, onError);
    }
    
    
    function getTree(okCallback, onError) {
        http({}, $http.get, '/tree/', okCallback, onError);
    }
    
    
    function getSearchResult(searchValue, okCallback, onError) {
    	const params = { searchValue: searchValue };
        http(params, $http.get, '/search', okCallback, onError);
    }
    
    
    function viewRecord(dataSource, id, okCallback, onError) {
        const params = { 
            dataSource: dataSource,
            id: id
        };
        http(params, $http.get, '/view_record/', okCallback, onError);
    }
    
    
    function sourceList(onData, onError) {
        http({}, $http.get, '/sources_list/', onData, onError);
    }
    
    
    function allNews(onData, onError) {
        http({}, $http.get, '/news', onData, onError);
    }
    
    
    function newsFromObject(sourceName, id, onData, onError) {
    	const params = {
    		sourceName: sourceName,
    		id: id
    	};
        http(params, $http.get, '/news/from_object', onData, onError);
    }
    
    
    function changePassword(onData, onError, oldPassword, newPassword) {
    	const params = {
    		oldPassword: oldPassword,
    		newPassword: newPassword	
    	};
        http(params, $http.put, '/user/change_password', onData, onError);
    }
    
    
    function downloadExcelFile(dataSource, onData, onError) {
    	const params = {
    		dataSource: dataSource	
    	};
        http(params, $http.get, '/download_excel', onData, onError);
    }
    
    
    this.getTable = getTable;
    this.getQueryData = getQueryData;
    this.getModelFields = getModelFields;
    this.createNewItem = createNewItem;
    this.deleteItem = deleteItem;
    this.getModelFieldsAndValues = getModelFieldsAndValues;
    this.saveItem = saveItem;
    this.getComboValues = getComboValues;
    this.getTree = getTree;
    this.getSearchResult = getSearchResult;
    this.viewRecord = viewRecord;
    this.sourceList = sourceList;
    this.allNews = allNews;
    this.newsFromObject = newsFromObject;
    this.changePassword = changePassword;
    this.downloadExcelFile = downloadExcelFile;
        
}]);