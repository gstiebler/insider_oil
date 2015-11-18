var router = require('express').Router();
var session = require('../lib/session');
var mainController = require('../controllers/main');

router.get('/', session.authorize, mainController.main );

module.exports = router;
