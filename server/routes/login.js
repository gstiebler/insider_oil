var router = require('express').Router();
var loginController = require('../controllers/login');

router.get('/', loginController.loginPage );
router.post('/', loginController.makeLogin );

module.exports = router;
