var router = require('express').Router();
var session = require('../lib/session');
var loginController = require('../controllers/login');

router.get('/', loginController.loginPage );
router.post('/', loginController.makeLogin );
router.put('/logout', session.authorize, loginController.logout );

module.exports = router;
