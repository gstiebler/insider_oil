"use strict"

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    }
  }, {
    underscored: true,
    tableName: 'users',
    instanceMethods: {
        generateToken: function( callback ) {
            let user = this;
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
