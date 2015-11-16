var express = require('express');
var router = express.Router();
var authorize = require('../lib/session');
var session = require('../lib/session');

/* GET home page. */
router.get('/', session.authorize, function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
