/* jshint indent: 4 */

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    login: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    underscored: true,
    tableName: 'users',
    instanceMethods: {
        generateToken: function( callback ) {
            user = this;
            require('crypto').randomBytes(48, function(ex, buf) {
                user.token = buf.toString('hex');
                user.save().then( function() {
                    callback( user.token );
                });
            });
        }
      }
    }
  );
  return User;
};
