var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function(req, res, next) {
    res.render('login', { title: 'Login' });
});


router.post('/', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err)
        return next(err);
    if (!user) 
        return res.redirect('/login');
    return res.redirect('/');
  })(req, res, next);
});

module.exports = router;
