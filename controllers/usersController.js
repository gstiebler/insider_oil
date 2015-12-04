
exports.main = function(req, res, next) {
  res.send('respond with a resource');
};

exports.userDetails = function(req, res, next) {
    user = {
        login: req.user.login,
        name: req.user.name,
        email: req.user.email
    };
    res.json( user );
}