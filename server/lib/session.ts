"use strict";
import db = require( '../db/models' );
import winston = require('winston');

function userFromToken( token ):Promise<any> {
    return db.models.User.findOne({ where: { token: token } });
}


export function login( username, password, loginOk, loginError ) {
    db.models.User.findOne({ where: { 
                        login: username} 
    }).then( function(user) {
        if( user )  {  
            if( user.password == password )
                user.generateToken( loginOk );
            else
                loginError('A senha está incorreta');
        } else
            loginError('Usuário não existe');
    });
}


export function authorizeHTML(req, res, next) {
    userFromToken( req.query.token ).then(callback);
    
    function callback( user ) {
        if( user ) {
            req.user = user;
            next();
        } else
            res.redirect('/login');
        return null;
    }
}


export function authorize(req, res, next) {
    var token = req.query.token;
    if( !token )
        token = req.body.token;
    if( !token )
        token = req.body.params.token;
        
    if( !token )
        invalidToken();
        
    userFromToken( token ).then(callback);
    
    function callback( user ) {
        if( user ) {
            req.user = user;
        	const logObj:any = {
        		path: req.route.path,
        		agent: req.headers['user-agent'],
        		query: req.query,
        		user: user.login,
                method: req.method
        	};
        	winston.info(JSON.stringify({access: logObj}));
            logObj.request = JSON.stringify(req.body);
            logObj.query = JSON.stringify(logObj.query);
            db.models.RequestLog.create( logObj ).catch((error) => {
                winston.error(error.stack);
            });
            next();
        } else
            invalidToken();
        return null;
    }
    
    function invalidToken() {
    	winston.info('invalid token');
        res.status(401).json({ errorMsg: 'Invalid token'});
    }
}


export function logout( user ) {
    user.token = '';
    user.save();
}
