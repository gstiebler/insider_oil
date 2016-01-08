var session = require('../lib/session');

var mainController = require('../controllers/mainController');
var loginController = require('../controllers/loginController');
var dbServerController = require('../controllers/dbServerController');
var usersController = require('../controllers/usersController');
var treeController = require('../controllers/TreeController');
var searchController = require('../controllers/SearchController');

module.exports = function(app) {
    // Main route
    app.get('/', session.authorizeHTML, mainController.main );
    
    // Login
    app.get('/login/',                             loginController.loginPage );
    app.post('/login/',                            loginController.makeLogin );
    app.post('/login_rest/',                       loginController.makeLoginREST );
    app.put('/login/logout',    session.authorize, loginController.logout );
    
    // DB Server
    app.get('/db_server/', session.authorize,      dbServerController.main);
    app.get('/model_fields/',                      dbServerController.modelFields);
    app.get('/record_values/',                     dbServerController.recordValues);
    app.get('/view_record/',                       dbServerController.viewRecord);
    app.post('/create_item/',                      dbServerController.createItem);
    app.put('/save_item/',                         dbServerController.saveItem);
    app.get('/sources_list/',                      dbServerController.sourcesList);
    app.delete('/delete_item/',                    dbServerController.deleteItem);
    app.get('/combo_values/', session.authorize,   dbServerController.getComboValues);
    app.post('/db_server/upload_file',             dbServerController.uploadFile);
    app.get('/search', session.authorize,         searchController.main);
    
    // Users
    app.get('/user/',           session.authorize, usersController.main );
    app.get('/user/details',    session.authorize, usersController.userDetails );
    
    // Tree
    app.get('/tree/',           session.authorize, treeController.main );
    
    // all links from Angular App should be redirected to the index of the app
    // send the URL as parameter for the Angular App to make the redirection
    app.get('/app/*', function (req, res) {
        return res.redirect('/app/templates/index.html?url=' + encodeURIComponent(req.url));
    });
}