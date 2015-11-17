var express = require('express');
var router = express.Router();
var session = require('../lib/session');

router.get('/', function(req, res, next) {
    res.render('login', { title: 'Login' });
});


router.post('/', function(req, res, next) {
    session.login( req.body.username, req.body.password, loginOk, loginError );
    
    function loginOk(token) {
        return res.redirect('/app/templates/index.html?token=' + token);
    }
    
    function loginError() {
        return res.redirect('/login');
    }
});

module.exports = router;
