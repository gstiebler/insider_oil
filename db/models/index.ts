'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');  
var winston   = require('winston');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../../../db/config/config.json');
var db:any    = {};

config.production.password = process.env.DB_PROD_PASSWORD;
config.production.host = process.env.DB_PROD_HOST;
config = config[env];

if (env == 'test') {
	winston.add(winston.transports.File, { filename: 'log/test.log' });
	winston.remove(winston.transports.Console);
}
	
winston.info('environment: ', env);


	
if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
	if(env == 'development' || env == 'test') {
		config.logging = function(text) {
			winston.info(text);
		}
	}
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    if (file.slice(-3) !== '.js') return;
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
  	if (db[modelName].defineHooks) {
	    db[modelName].defineHooks(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
