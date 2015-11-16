var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../db/models');

passport.use(new LocalStrategy(
  function(username, password, done) {
    db.User.findOne( {where: { login: username } }).then( function (user) {
        if (!user) {
            return done(null, false, { message: 'Usuário desconhecido.' });
        }
        if (user.password != password) {
            return done(null, false, { message: 'Senha incorreta.' });
        }
        return done(null, user);
    }).catch( function(err) {
        return done(err);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.User.findById(id).then( function(user) {
    done(null, user);
  }).catch( function(err) {
    done(err, null);
  });
});

module.exports = passport;