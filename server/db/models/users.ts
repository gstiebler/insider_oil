"use strict"

function beforeUpdate(user) {
    if(!user.dataValues.active) {
        user.token = null;
    }
}

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
      allowNull: true,
      defaultValue: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    paying: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
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
      },
		classMethods: {
			  defineHooks: function(db) {
	        db.User.hook('beforeUpdate', beforeUpdate);
        }
    }
    }
  );
  return User;
};
