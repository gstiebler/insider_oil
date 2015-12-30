'use strict';

var fs        = require('fs');
var path      = require('path');
var basename  = path.basename(module.filename);

var params = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    if (file.slice(-3) !== '.js') return;
    let completePath = path.join(__dirname, file);
    let content = require(completePath);
    params = Object.assign(params, content);
  });

module.exports = params;
