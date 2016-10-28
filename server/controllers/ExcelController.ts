"use strict";
import db = require('../db/models');
var Sync = require('sync');	
var request = require('request');
import ControllerUtils = require('../lib/ControllerUtils');
import dbUtils = require('../lib/dbUtils');
import ExportExcel = require('../lib/excel/ExportExcel');
import importExcel = require('../lib/excel/importExcel');
import dsParams = require('../lib/DataSourcesParams');
import express = require("express");
import { IExcelUploadResponse } from '../lib/excel/ImportExcelClass';
import winston = require('winston');
import * as ni from '../../common/NetworkInterfaces';
import * as ExportExcelQuery from '../lib/excel/ExportExcelQuery';


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
        
        importExcel(body, dataSourceName).then(onOk).catch(errorFunc);
    })
    
    function onOk(result:IExcelUploadResponse) {
        res.json( { status: result.status, recordsStatus: result.invalidRecordsStatus } );
    }
}

export function uploadFile(req: express.Request, res: express.Response, next) {
    var buf = JSON.parse(req.body.data);
    var model = req.body.model;
    try {
        importExcel(buf, model).then(onOk).catch(onError);
    } catch(err) {
        res.status(400).json( { errorMsg: err } );
    }

    function onOk(result:IExcelUploadResponse) {
        res.json( { status: result.status, recordsStatus: result.invalidRecordsStatus } );
    }
    
    function onError(err) {
        winston.error(err);
        res.status(400).json( { errorMsg: err } );
    }
      
    function onFinish() {
    	winston.info('Done parsing form!');
    };
}

export async function downloadExcelFromQuery(req: express.Request, res: express.Response) { try {
    const reqQuery:ni.GetExcelQuery.req = req.query;
    reqQuery.queryParams.pagination = null;
    const result = await dbUtils.getTableQueryData(reqQuery);

    const binaryWorkbook = ExportExcelQuery.exportToExcel(result.records, result.fields, req.user.paying);
    res.set({"Content-Disposition":'attachment; filename="arquivo.xlsx"'});
    res.set('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(binaryWorkbook);
} catch(err) { ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados.")(err); } }