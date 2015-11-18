var router = require('express').Router();
var session = require('../lib/session');
var dbServerController = require('../controllers/dbServerController');

router.get('/', dbServerController.main );

module.exports = router;
