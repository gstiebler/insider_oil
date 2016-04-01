var session = require('../lib/session');


exports.loginPage = function(req, res, next) {
    res.render('login', { title: 'Login'} );
};


exports.makeLogin = function(req, res, next) {
    session.login( req.body.username, req.body.password, loginOk, loginError );
    
    function loginOk(token) {
        res.redirect('/app/templates/index.html?token=' + token);
    }
    
    function loginError(errorMsg) {
        res.render('login', { title: 'Login', errorMsg: errorMsg });
    }
};


exports.makeLoginREST = function(req, res, next) {
    session.login( req.body.username, req.body.password, loginOk, loginError );
    
    function loginOk(token) {
        res.json( { token: token } );
    }
    
    function loginError() {
        res.status(404).json( { msg: 'Erro no login' } );
    }
};


exports.logout = function(req, res, next) {
    session.logout(req.user);
    res.json( { msg: 'Usuário deslogado.' } );
}