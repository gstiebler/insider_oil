"use strict";
var db = require('../db/models');
var dbUtils = require('../lib/dbUtils');
var ControllerUtils = require('../lib/ControllerUtils');
var Sync = require('sync');	
var await = require('../lib/await');


exports.main = function(req, res, next) { Sync(function() {
    const dataSourceName = req.query.dataSource;
    const dataSource = db[dataSourceName];
    try {
        const records = await( dbUtils.findAllCustom(dataSource, {}, {}) );
        res.json(records);
    } catch(e) {
    	console.error(e.stack);
    	ControllerUtils.getErrorFunc(res, 500, "Problema")(e);
        return;
    }
}) }