'use strict';

var tree = require('../lib/Tree');
var Sync = require('sync');	
var dbUtils = require('../lib/dbUtils');
var winston = require('winston');
var await = require('../lib/await');

exports.main = function(req, res, next) { Sync(function() {
    try{
        const dataSourceName = req.query.dataSource;
        const id = req.query.id;
        const fieldName = req.query.fieldName;
        const model = dbUtils.getDataSource(dataSourceName);
        const record = await( model.findById(id) );
        res.set('Content-type', 'image/jpg');
        const valuesArray = record[fieldName];
        res.send(valuesArray);
    } catch(error) {
        winston.error(error.stack);
    }
}) }
