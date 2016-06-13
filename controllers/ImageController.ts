'use strict';

var Sync = require('sync');	
import dbUtils = require("../lib/dbUtils");
import  winston = require('winston');
var await = require('../lib/await');

export function main(req, res, next) { Sync(function() {
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
