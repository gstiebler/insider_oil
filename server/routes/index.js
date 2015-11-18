var main = require('./main');
var users = require('../routes/users');
var login = require('../routes/login');


module.exports = function(app) {
    app.use('/', main);
    app.use('/user', users);
    app.use('/login', login);
}