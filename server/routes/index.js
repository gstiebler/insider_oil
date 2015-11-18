var main = require('./main');
var users = require('./users');
var login = require('./login');
var dbServer = require('./db_server');


module.exports = function(app) {
    app.use('/', main);
    app.use('/user', users);
    app.use('/login', login);
    app.use('/db_server', dbServer);
    
    app.get('/app/*', function (req, res) {
        return res.redirect('/app/templates/index.html?url=' + encodeURIComponent(req.url));
    });
}