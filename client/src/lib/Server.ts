import * as session from './session';
import * as jquery from 'jquery';
import * as remoteServer from '../../../common/Interfaces';
import * as Promise from 'bluebird';

function ajax(url: string, data: any, type:string, onSuccess?, onError?) {
    data.token = session.getToken();
    var ajaxOpt:any = {
        url: url,
        data: data,
        type: type,
    };
    if(onSuccess) {
        ajaxOpt.success = onSuccess;
    }
    if(onError) {
        ajaxOpt.error = onError;
    }

    jquery.ajax(ajaxOpt);
}

function get(url: string, data: any, onSuccess?, onError?) {
    ajax(url, data, 'GET', onSuccess, onError);
}

function getP(url: string, data: any):Promise<any> {
    return new Promise<any>( function(resolve, reject) {
        ajax(url, data, 'GET', (result) => { resolve(result) }, 
                (error) => { reject(error) });
    });
}

function put(url: string, data: any, onSuccess?, onError?) {
    ajax(url, data, 'PUT', onSuccess, onError);
}

function post(url: string, data: any, onSuccess?, onError?) {
    ajax(url, data, 'POST', onSuccess, onError);
}

function deleteHTTP(url: string, data: any, onSuccess?, onError?) {
    ajax(url, data, 'DELETE', onSuccess, onError);
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
    get('/db_server/', params, okCallback, errorCallback);
}

/**
 * Return multiple records from a query
 * @param {} options Options (queryName and filters)
 * @return Promise
 */
export function getQueryData(options):Promise<any> {
    var params = { 
        queryName: options.queryName,
        filters: options.filters,
        token: session.getToken()
    };
    
    return getP('/get_query_data', params);
}

/**
 * Return multiple records from a table data source
 * @param {} options Options (queryName and queryParams)
 *   queryParams:
 *     order: string[]
 *     filters: {field, like}
 *     pagination: {first, itemsPerPage}
 */
export function getTableData( options ):Promise<remoteServer.TableQueryDataRes> {
    var params = { 
        queryName: options.queryName,
        queryParams: options.queryParams,
        token: session.getToken()
    };
    
    return getP('/get_table_data', options);
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
    
    post('/create_item/', params, onSave, onError);
}


export function deleteItem( modelName, id, onDelete, onError ) {
    var params = {
        model: modelName,
        id: id,
        token: session.getToken()
    };
    
    deleteHTTP('/delete_item/', params, onDelete, onError);
}


export function getModelFieldsAndValues( modelName, id ):Promise<any> {
    var params = { 
        model: modelName,
        id: id,
        token: session.getToken()
    };
    return getP('/record_values/', params );
}


export function saveItem( modelName, record, onSave, onError ) {
    var params = {
        model: modelName,
        record: JSON.stringify(record),
        token: session.getToken()
    };
    
    put('/save_item/', params, onSave, onError);
}


export function getComboValues(modelName, okCallback, onError) {
    var params = { 
        model: modelName,
        token: session.getToken()
    };
    get('/combo_values/', params, okCallback, onError);
}


export function getTree(okCallback, onError) {
    get('/tree/', {}, okCallback, onError);
}


export function getSearchResult(searchValue, okCallback, onError) {
    var params = { searchValue: searchValue };
    get('/search', params, okCallback, onError);
}


export function viewRecord(dataSource, id, okCallback, onError) {
    var params = { 
        dataSource: dataSource,
        id: id
    };
    get('/view_record/', params, okCallback, onError);
}


export function sourceList(onData, onError) {
    get('/sources_list/', {}, onData, onError);
}


export function changePassword(onData, onError, oldPassword, newPassword) {
    var params = {
        oldPassword: oldPassword,
        newPassword: newPassword	
    };
    put('/user/change_password', params, onData, onError);
}


export function downloadExcelFile(dataSource, onData, onError) {
    var params = {
        dataSource: dataSource	
    };
    get('/download_excel', params, onData, onError);
}


export function importFromURL(dataSource, onData, onError) {
    var params = { dataSource: dataSource };
    put('/import_from_url', params, onData, onError);
}