"use strict";
var db = require('../db/models');
var dbUtils = require('../lib/dbUtils');
var ControllerUtils = require('../lib/ControllerUtils');
var Sync = require('sync');	
var await = require('../lib/await');
var ExportExcel = require('../lib/ExportExcel');
var importExcel = require('../lib/importExcel');
var dsParams = require('../lib/DataSourcesParams');
var request = require('request');


function downloadExcel(req, res, next) { Sync(function() {
    const dataSourceName = req.query.dataSource;
    const binaryWorkbook = ExportExcel.main(dataSourceName);
    res.set({"Content-Disposition":'attachment; filename="arquivo.xlsx"'});
    res.set('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(binaryWorkbook);
}) }


function importExcelFromURL(req, res) {
    const dataSourceName = req.body.params.dataSource;
    const viewParams = dsParams[dataSourceName];
    const url = viewParams.urlSource;
    
    const errorFunc = ControllerUtils.getErrorFunc(res, 500, "Erro ao importar Excel da URL");
    const options = {
        url: url,
        encoding: null  
    };
    request(options, function (error, excelResponse, body) {
        if (error || excelResponse.statusCode != 200) {
            errorFunc(err);
            return;
        } 
        
        try {
            importExcel(body, dataSourceName, onOk, errorFunc);
        } catch(err) {
            errorFunc(err);
        }
    })
    
    function onOk(status, recordsStatus) {
        res.json( { status: status, recordsStatus: recordsStatus } );
    }
}


exports.downloadExcel = downloadExcel;
exports.importExcelFromURL = importExcelFromURL;