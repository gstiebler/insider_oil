"use strict";
import db = require( '../db/models' );
import winston = require('winston');

export function userFromToken( token ):Promise<any> {
    if(!token || token == '') {
        return Promise.resolve(null);
    }
    return db.models.User.findOne({ where: { token: token } });
}

/**
 * Returns the token from the user, 
 * or throws an error if the login is unsucessful 
 */
export async function login(username: string, password: string):Promise<string> {
    const user = await db.models.User.findOne({ where: { login: username} });
    if( user && user.active )  {  
        if( user.password == password ) {
            return await user.generateToken();
        } else {
            throw 'A senha está incorreta';
        }
    } else {
        throw 'Usuário não existe';
    }
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
    if(!token)
        token = req.body.token;
    if(!token && req.body.params)
        token = req.body.params.token;
        
    if( !token ) {
        invalidToken();
        return;
    }
        
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
