"use strict";
var db  = require('../db/models');
var Sync = require('sync');

exports.main = function(req, res, next) {
  res.send('respond with a resource');
};


exports.userDetails = function(req, res, next) {
    const user = {
        login: req.user.login,
        name: req.user.name,
        email: req.user.email,
        id: req.user.id
    };
    res.json( user );
}


exports.changePassword = function(req, res, next) {
Sync( () => {
    const oldPassword = req.body.params.oldPassword;
    const newPassword = req.body.params.newPassword;
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
})
}