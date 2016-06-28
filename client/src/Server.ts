import * as session from './session';
import * as jquery from 'jquery';


function get(url: string, data: any, onSuccess?, onError?) {
    var ajaxOpt:any = {
        url: '/user/details',
        data: data,
    };
    if(onSuccess) {
        ajaxOpt.success = onSuccess;
    }
    if(onError) {
        ajaxOpt.error = onError;
    }

    jquery.ajax(ajaxOpt);
}

function http(params, httpFunc, path, okCallback, onError) {
    params.token = session.getToken();
    
    httpFunc(path, { params: params })
    .then(function(response) {
        okCallback(response.data);
    }, onError);
}
    
/**
 * Get user details
 * @param {Function} onData Result callback
 * @param {Function} onError Error callback
 */
export function getUserDetails(onData, onError) {
    var params = { token: session.getToken() };
    get('/user/details', params, onData, onError);
}

/**
 * Return multiple records
 * @param {String} table Name of the datasource
 * @param {} options Options (filters and fields)
 * @param {Function} okCallback Result callback
 * @param {Function} errorCallback Error callback
 */
export function getTable( table, options, okCallback, errorCallback ) {
    var params = { 
        table: table,
        filters: options.filters,
        fieldNames: options.fieldNames,
        token: session.getToken()
    };
    
    get('/db_server/', { params: params }, function(response) {
        okCallback(response.data);
    }, errorCallback);
}

/**
 * Return multiple records from a query
 * @param {} options Options (queryName and filters)
 * @param {Function} okCallback Result callback
 * @param {Function} errorCallback Error callback
 */
export function getQueryData( options, okCallback, errorCallback ) {
    var params = { 
        queryName: options.queryName,
        filters: options.filters,
        token: session.getToken()
    };
    
    get('/get_query_data', { params: params }, function(response) {
        okCallback(response.data);
    }, errorCallback);
}

/**
 * Return multiple records from a table data source
 * @param {} options Options (queryName and queryParams)
 *   queryParams:
 *     order: string[]
 *     filters: {field, like}
 *     pagination: {first, itemsPerPage}
 * @param {Function} okCallback Result callback
 * @param {Function} errorCallback Error callback
 */
export function getTableData( options, okCallback, errorCallback ) {
    var params = { 
        queryName: options.queryName,
        queryParams: options.queryParams,
        token: session.getToken()
    };
    
    get('/get_table_data', { params: params }, function(response) {
        okCallback(response.data);
    }, errorCallback);
}

export function getTimeSeries( options, okCallback, errorCallback ) {
    var params = { 
        queryName: options.queryName,
        queryParams: options.queryParams,
        token: session.getToken()
    };
    
    get('/time_series', { params: params }, function(response) {
        okCallback(response.data);
    }, errorCallback);
}


export function getModelFields( model, okCallback, errorCallback ) {
    var params = { 
        model: model,
        token: session.getToken()
    };
    
    get('/model_fields/', { params: params }, function(response) {
        okCallback(response.data.fields);
    }, errorCallback);
}


export function createNewItem( modelName, newItemData, onSave, onError ) {
    var params = {
        model: modelName,
        newItemData: newItemData,
        token: session.getToken()
    };
    
    $http.post('/create_item/', params ).then(onSave, onError);
}


export function deleteItem( modelName, id, onDelete, onError ) {
    var params = {
        model: modelName,
        id: id,
        token: session.getToken()
    };
    
    $http.delete('/delete_item/', { params: params }).then(onDelete, onError);
}


export function getModelFieldsAndValues( modelName, id, okCallback, errorCallback ) {
    var params = { 
        model: modelName,
        id: id,
        token: session.getToken()
    };
    
    $http.get('/record_values/', { params: params }).
    then(function(response) {
        okCallback(response.data);
    }, errorCallback);
}


export function saveItem( modelName, record, onSave, onError ) {
    var params = {
        model: modelName,
        record: record,
        token: session.getToken()
    };
    
    $http.put('/save_item/', params ).then(onSave, onError);
}


export function getComboValues(modelName, okCallback, onError) {
    var params = { model: modelName };
    http(params, $http.get, '/combo_values/', okCallback, onError);
}


export function getTree(okCallback, onError) {
    http({}, $http.get, '/tree/', okCallback, onError);
}


export function getSearchResult(searchValue, okCallback, onError) {
    var params = { searchValue: searchValue };
    http(params, $http.get, '/search', okCallback, onError);
}


export function viewRecord(dataSource, id, okCallback, onError) {
    var params = { 
        dataSource: dataSource,
        id: id
    };
    http(params, $http.get, '/view_record/', okCallback, onError);
}


export function sourceList(onData, onError) {
    http({}, $http.get, '/sources_list/', onData, onError);
}


export function changePassword(onData, onError, oldPassword, newPassword) {
    var params = {
        oldPassword: oldPassword,
        newPassword: newPassword	
    };
    http(params, $http.put, '/user/change_password', onData, onError);
}


export function downloadExcelFile(dataSource, onData, onError) {
    var params = {
        dataSource: dataSource	
    };
    http(params, $http.get, '/download_excel', onData, onError);
}


export function importFromURL(dataSource, onData, onError) {
    var params = {
        dataSource: dataSource	
    };
    http(params, $http.put, '/import_from_url', onData, onError);
}