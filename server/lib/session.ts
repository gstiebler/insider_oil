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

function authorize(req, res, next, checkAdmin) {
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
            if(checkAdmin && !user.admin) {
                winston.info('invalid admin request');
                res.status(401).json({ errorMsg: 'Not admin'});
                return;
            }
            req.user = user;
        	const logObj:any = {
        		path: req.route.path,
        		agent: req.headers['user-agent'],
        		query: req.query,
        		user: user.login,
                method: req.method
        	};
        	//winston.info(JSON.stringify({access: logObj}));
            try {
                if(req._body) {
                    logObj.request = JSON.stringify(req.body).substr(0, 250);
                }
                logObj.query = JSON.stringify(logObj.query);
                db.models.RequestLog.create( logObj ).catch((error) => {
                    winston.error(error.stack);
                });
            } catch (err) {
                winston.error(err);
            }
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

export function authAdmin(req, res, next) {
    authorize(req, res, next, true);
}

export function authUser(req, res, next) {
    authorize(req, res, next, false);
}


export function logout( user ) {
    user.token = '';
    user.save();
}
