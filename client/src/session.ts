
import * as cookie from 'js-cookie';

export function login(token) {
    cookie.set('token', token);
}
    
export function logout() {
    var token = cookie.get('token');
    // TODO change to /session/logout
    /*$http.put('/login/logout', { params: { token: token } }).then(logoutOk, logoutError);
    
    function logoutOk(response) {        
        cookie.put( 'token', '' );
        $window.location.href = '/';
        //$location.path("/");
    }
    
    function logoutError(response) {
        showError.show( "Error on logout: " + response );
    }*/
};
    
export function getToken() {
    return cookie.get('token');
}