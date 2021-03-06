
import * as cookie from 'js-cookie';
import * as jquery from 'jquery';
import * as showError from './ShowError';
import { Router, Route, Link, browserHistory } from 'react-router';

export function login(token) {
    cookie.set('token', token);
}
    
export function logout() {
    var token = cookie.get('token');    
    cookie.set( 'token', '' );
    // TODO change to /session/logout
    jquery.ajax({
        url: '/login/logout',
        type: 'PUT',
        data: { token: token },
        success: logoutOk,
        error: logoutError
    });
    
    function logoutOk(response) {    
        browserHistory.push('/');
    }
    
    function logoutError(xhr, ajaxOptions, thrownError) {
        showError.show( "Error on logout: " + xhr.responseText );
    }
};
    
export function getToken() {
    return cookie.get('token');
}