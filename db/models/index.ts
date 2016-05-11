'use strict';

import fs        = require('fs');
import path      = require('path');
import Sequelize = require('sequelize');  
import winston   = require('winston');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../../../db/config/config.json');


var models:any = {};

config.production.password = process.env.DB_PROD_PASSWORD;
config.production.host = process.env.DB_PROD_HOST;
config = config[env];

if (env == 'test') {
    winston.level = 'error';
	winston.add(winston.transports.File, { filename: 'log/test.log', level: 'info' });
  if(process.env.HIDE_WINSTON_ERRORS) {
    winston.remove(winston.transports.Console);
  }
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
    var model:any = sequelize['import'](path.join(__dirname, file));
    models[model.name] = model;
  });

Object.keys(models).forEach(function(modelName) {
  if (models[modelName].associate) {
models[modelName].associate(models);
  }
  	if (models[modelName].defineHooks) {
	    models[modelName].defineHooks(models);
	}
});

export = { 
    sequelize,
    Sequelize,
    models
 };
