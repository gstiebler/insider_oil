var session = require('../lib/session');

var mainController = require('../controllers/main');
var loginController = require('../controllers/login');
var dbServerController = require('../controllers/dbServerController');
var usersController = require('../controllers/users');

module.exports = function(app) {
    // Main route
    app.get('/', session.authorizeHTML, mainController.main );
    
    // Login
    app.get('/login/',                             loginController.loginPage );
    app.post('/login/',                            loginController.makeLogin );
    app.put('/login/logout',    session.authorize, loginController.logout );
    
    // DB Server
    app.get('/db_server/',                         dbServerController.main);
    
    // Users
    app.get('/user/',           session.authorize, usersController.main );
    app.get('/user/details',    session.authorize, usersController.userDetails );
    
    // all links from Angular App should be redirected to the index of the app
    // send the URL as parameter for the Angular App to make the redirection
    app.get('/app/*', function (req, res) {
        return res.redirect('/app/templates/index.html?url=' + encodeURIComponent(req.url));
    });
}