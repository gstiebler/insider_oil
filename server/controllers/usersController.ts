"use strict";
import db  = require('../db/models');
var Sync = require('sync');
import ControllerUtils = require('../lib/ControllerUtils');

export function main(req, res, next) {
  res.send('respond with a resource');
};


export function userDetails(req, res, next) {
    const user = {
        login: req.user.login,
        name: req.user.name,
        email: req.user.email,
        id: req.user.id,
        admin: req.user.admin
    };
    res.json( user );
}


export function changePassword(req, res, next) {
Sync( () => {
    try {
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const user = req.user;
        
        if(user.password != oldPassword) {
            res.json({ errorMsg: 'A senha atual está incorreta.' });
            return;
        }
        if(newPassword.length < 8) {
            res.json({ errorMsg: 'A senha deve conter pelo menos 8 caracteres' });
            return;
        }
        user.password = newPassword;
        user.save();
        res.json({msg: 'OK'});
    } catch(error) {
    	ControllerUtils.getErrorFunc(res, 500, "Erro")(error);
    }
})
}