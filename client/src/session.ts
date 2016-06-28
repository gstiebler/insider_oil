
export function login(token) {
    //$cookies.put( 'token', token );
}
    
export function logout() {
    /*var token = $cookies.get('token');
    // TODO change to /session/logout
    $http.put('/login/logout', { params: { token: token } }).then(logoutOk, logoutError);
    
    function logoutOk(response) {        
        $cookies.put( 'token', '' );
        $window.location.href = '/';
        //$location.path("/");
    }
    
    function logoutError(response) {
        showError.show( "Error on logout: " + response );
    }*/
};
    
export function getToken() {
    //return $cookies.get('token');
}