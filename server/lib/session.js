var db = require( '../db/models' );
var await = require('./await');

function userFromToken( token, callback ) {
    db.User.findOne({ where: { token: token } }).then(callback);
}


exports.login = function( username, password, loginOk, loginError ) {
    db.User.findOne({ where: { 
                        login: username,
                        password: password} 
    }).then( function(user) {
        if( user )  {  
            user.generateToken( loginOk );
        } else
            loginError();
    });
}


exports.authorizeHTML = function(req, res, next) {
    var user = userFromToken( req.query.token, callback );
    
    function callback( user ) {
        if( user ) {
            req.user = user;
            next();
        } else
            res.redirect('/login');
    }
}


exports.authorize = function(req, res, next) {
    var token = req.query.token;
    if( !token )
        token = req.body.params.token;
        
    userFromToken( token, callback );
    
    function callback( user ) {
        if( user ) {
            req.user = user;
            next();
        } else
            res.status(401).json({ errorMsg: 'Invalid token'});
    }
}


exports.logout = function( user ) {
    user.token = '';
    user.save();
}
