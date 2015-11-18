var router = require('express').Router();
var session = require('../lib/session');
var usersController = require('../controllers/users');

router.get('/', session.authorize, usersController.main );

module.exports = router;
