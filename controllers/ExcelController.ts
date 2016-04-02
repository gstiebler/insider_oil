"use strict";
var db = require('../db/models');
var Sync = require('sync');	
var await = require('../lib/await');
var request = require('request');
import ControllerUtils = require('../lib/ControllerUtils');
import dbUtils = require('../lib/dbUtils');
import ExportExcel = require('../lib/ExportExcel');
import importExcel = require('../lib/importExcel');
import dsParams = require('../lib/DataSourcesParams');
import express = require("express");


export function downloadExcel(req: express.Request, res: express.Response, next) { Sync(function() {
    const dataSourceName = req.query.dataSource;
    const binaryWorkbook = ExportExcel.main(dataSourceName);
    res.set({"Content-Disposition":'attachment; filename="arquivo.xlsx"'});
    res.set('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(binaryWorkbook);
}) }


export function importExcelFromURL(req: express.Request, res: express.Response) {
    const dataSourceName:string = req.body.params.dataSource;
    const viewParams = dsParams[dataSourceName];
    const url = viewParams.urlSource;
    
    const errorFunc = ControllerUtils.getErrorFunc(res, 500, "Erro ao importar Excel da URL");
    const options = {
        url: url,
        encoding: null  
    };
    request(options, function (error, excelResponse, body) {
        if (error || excelResponse.statusCode != 200) {
            errorFunc(error);
            return;
        } 
        
        try {
            importExcel(body, dataSourceName, onOk, errorFunc);
        } catch(err) {
            errorFunc(err);
        }
    })
    
    function onOk(status: string, recordsStatus: string[]) {
        res.json( { status: status, recordsStatus: recordsStatus } );
    }
}


exports.downloadExcel = downloadExcel;
exports.importExcelFromURL = importExcelFromURL;