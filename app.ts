'use strict';
import express = require("express");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var winston = require('winston');
var umzug = require('./lib/InitUmzug');
var app = express();

// Make necessary migrations
umzug.up();

// Generate minified Angular js files
require('./lib/uglifyJsFrontend').uglifyAngularJsFiles(app.get('env'));

// Configure Winston log lib
winston.level = 'debug';
if (app.get('env') == 'development') {
	winston.add(winston.transports.File, { filename: 'log/development.log' });
}

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));

if (app.get('env') != 'test') {
	app.use(logger('dev'));
}
app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/app/ext_libs', express.static(path.join(__dirname, '/../client/bower_components')));
app.use('/app', express.static(path.join(__dirname, '/../client/angular-app')));

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