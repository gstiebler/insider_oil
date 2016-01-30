"use strict";
var db = require('../db/models');
var dbUtils = require('../lib/dbUtils');
var ControllerUtils = require('../lib/ControllerUtils');
var Sync = require('sync');	
var await = require('../lib/await');
var ExportExcel = require('../lib/ExportExcel');


exports.main = function(req, res, next) { Sync(function() {
    const dataSourceName = req.query.dataSource;
    const binaryWorkbook = ExportExcel.main(dataSourceName);
    res.set({"Content-Disposition":'attachment; filename="arquivo.xlsx"'});
    res.set('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(binaryWorkbook);
}) }