import * as session from './session';
import * as jquery from 'jquery';
import * as remoteServer from '../../../common/Interfaces';
import * as Promise from 'bluebird';
import * as ni from '../../../common/NetworkInterfaces';

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

export function getP(url: string, data: any):Promise<any> {
    return new Promise<any>( function(resolve, reject) {
        ajax(url, data, 'GET', (result) => { resolve(result) }, 
                (error) => { reject(error) });
    });
}

function putP(url: string, data: any):Promise<any> {
    return new Promise<any>( function(resolve, reject) {
        ajax(url, data, 'PUT', (result) => { resolve(result) }, 
                (error) => { reject(error) });
    });
}

export function postP(url: string, data: any):Promise<any> {
    return new Promise<any>( function(resolve, reject) {
        ajax(url, data, 'POST', (result) => { resolve(result) }, 
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
    get('/user/details', {}, onData, onError);
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
    return getP('/get_table_data', options);
}

export function getTimeSeries(options):Promise<any> {
    return getP('/time_series', options);
}


export function getModelFields(model):Promise<any> {
    var params = { model: model, };
    return getP('/model_fields/', params );
}


export function createNewItem( modelName, newItemData, onSave, onError ) {
    var params = {
        model: modelName,
        newItemData: JSON.stringify(newItemData),
    };
    
    post('/create_item/', params, onSave, onError);
}


export function deleteItem( modelName, id, onDelete, onError ) {
    var params = {
        model: modelName,
        id: id,
    };
    
    deleteHTTP('/delete_item/', params, onDelete, onError);
}


export function getModelFieldsAndValues( modelName, id ):Promise<any> {
    var params = { 
        model: modelName,
        id: id,
    };
    return getP('/record_values/', params );
}


export function saveItem( modelName, record, onSave, onError ) {
    var params = {
        model: modelName,
        record: JSON.stringify(record),
    };
    
    put('/save_item/', params, onSave, onError);
}


export function getComboValues(modelName, okCallback, onError) {
    var params = { 
        model: modelName,
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
    var params = { dataSource, id };
    get('/view_record/', params, okCallback, onError);
}


export function sourceList(onData, onError) {
    get('/sources_list/', {}, onData, onError);
}


export function changePassword(oldPassword, newPassword):Promise<any> {
    var params = { oldPassword, newPassword	};
    return putP('/user/change_password', params);
}


export function downloadExcelFile(dataSource, onData, onError) {
    var params = { dataSource };
    get('/download_excel', params, onData, onError);
}


export function importFromURL(dataSource, onData, onError) {
    var params = { dataSource };
    put('/import_from_url', params, onData, onError);
}