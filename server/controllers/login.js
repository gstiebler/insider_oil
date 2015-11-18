var session = require('../lib/session');


exports.loginPage = function(req, res, next) {
    res.render('login', { title: 'Login' });
};


exports.makeLogin = function(req, res, next) {
    session.login( req.body.username, req.body.password, loginOk, loginError );
    
    function loginOk(token) {
        return res.redirect('/app/templates/index.html?token=' + token);
    }
    
    function loginError() {
        return res.redirect('/login');
    }
};
