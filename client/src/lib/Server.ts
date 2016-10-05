import * as session from './session';
import * as jquery from 'jquery';
import * as remoteServer from '../../../common/Interfaces';
import * as Promise from 'bluebird';
import * as ni from '../../../common/NetworkInterfaces';
import { browserHistory } from 'react-router';

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

    function onError(reject, error) {
        reject(error);
        // if the user was not authorized
        if(error.status == 401) {
            window.location.replace('/login');
        }
    }

    return new Promise<any>( function(resolve, reject) {
        ajax(url, data, 'GET', (result) => { resolve(result) }, 
               onError.bind(this, reject));
    });
}

export function putP(url: string, data: any):Promise<any> {
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
export function getQueryData(params: ni.GetQueryData.req):Promise<ni.GetQueryData.res> {
    return getP('/get_query_data', params);
}

/**
 * Return multiple records from a table data source
 */
export function getTableData(req: ni.GetTableQueryData.req):Promise<ni.GetTableQueryData.res> {
    return getP('/get_table_data', req);
}

export function getTimeSeries(options):Promise<any> {
    return getP('/time_series', options);
}


export function getModelFields(model):Promise<any> {
    var params = { model: model, };
    return getP('/model_fields/', params );
}

export function deleteItem( modelName, id, onDelete, onError ) {
    var params = {
        model: modelName,
        id: id,
    };
    
    deleteHTTP('/delete_item/', params, onDelete, onError);
}

export function getSearchResult(searchValue, okCallback, onError) {
    var params = { searchValue: searchValue };
    get('/search', params, okCallback, onError);
}


export function viewRecord(dataSource, id):Promise<ni.GetViewRecord.res> {
    const params:ni.GetViewRecord.req = { dataSource, id };
    return getP('/view_record/', params);
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

export const paths = {
    baseImg: 'https://s3-sa-east-1.amazonaws.com/insider-oil/images/'
}