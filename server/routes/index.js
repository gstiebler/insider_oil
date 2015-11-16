var express = require('express');
var router = express.Router();
var passport = require('passport');
var authorize = require('../lib/session');

/* GET home page. */
router.get('/', authorize, function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
