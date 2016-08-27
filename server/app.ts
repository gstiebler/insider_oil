'use strict';
import express = require("express");
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
import winston = require('winston');
var umzug = require('./lib/InitUmzug');
var app = express();
import { initializeSearch } from './lib/search';
import { syncify } from './lib/PromiseUtils';
import db = require('./db/models');

// Make necessary migrations
umzug.up();
syncify( initializeSearch );

// Configure Winston log lib
if (app.get('env') == 'production') {
    winston.remove(winston.transports.Console);
    winston.level = 'error';	
    const options = {
        level: 'error',
        silent: true
    };
    const errorLogger = winston.add(winston.transports.Console, options);
    errorLogger.on('logging', function (transport, level, msg) {
        db.models.ErrorLog.create({ error: msg });
        console.error(msg);
    });
} else if (app.get('env') == 'development') {
    winston.level = 'debug';
	  winston.add(winston.transports.File, { filename: 'log/development.log' });
}

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));

app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.raw({limit: '20mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '20mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/app/ext_libs', express.static(path.join(__dirname, '/../../client/node_modules')));
app.use('/app', express.static(path.join(__dirname, '/../../client/dist')));

routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err:any = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req: express.Request, res: express.Response) {
    winston.error(err.stack);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req: express.Request, res: express.Response) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


process.on('uncaughtException', function (err) {
    winston.error(err.stack);
})

module.exports = app;