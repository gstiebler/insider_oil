'use strict';

import db = require('../db/models');
var Sync = require('sync');
var await = require('../lib/await');
import ControllerUtils = require('../lib/ControllerUtils');
import winston = require('winston');
import dbUtils = require("../lib/dbUtils");
import dsParams = require('../lib/DataSourcesParams');
import express = require("express");
import DataSourceOperations = require('../lib/DataSourceOperations/index');
import QueriesById = require('../db/queries/QueriesById');
import TableQueries = require('../db/queries/TableQueries');
import QueryGenerator = require('../db/queries/QueryGenerator');
import TimeSeriesQueries = require('../db/queries/TimeSeriesQueries');
import { IExcelUploadResponse } from '../lib/excel/ImportExcelClass';
import { getRecordOptions, IGetRecordOptions } from '../lib/GetRecordOptions';
import Sequelize = require('sequelize');
import * as interfaces from '../../common/Interfaces';
import * as ni from '../../common/NetworkInterfaces';

export function sendErrorReport(req: express.Request, res: express.Response, next) {
    const body:ni.SendErrorReport.req = req.body;
    const errorReportRecord = {
        url: body.url,
        description: body.description, 
        reporter_id: req.user.id, 
        status: 'Em aberto'
    }
    db.models.ErrorReport.create(errorReportRecord).then(result => {
        const resObj: ni.SendErrorReport.res = { msg: 'OK' };
        res.json(resObj);
    }).catch(ControllerUtils.getErrorFunc(res, 500, "Erro"));
}

export function viewRecord(req: express.Request, res: express.Response, next) {
    const query:ni.GetViewRecord.req = req.query;
    const dataSourceName = query.dataSource;
    const id = query.id;
    const dataSource = dbUtils.getDataSource(dataSourceName);
    const options: any = {};
    options.include = [{all: true}];
    dataSource.findById(id, options)
        .then(onRecord)
        .catch(ControllerUtils.getErrorFunc(res, 404, "Registro não encontrado"));
    
    function onRecord(record) { Sync(function() {  
        try {         
            const dsOperations = DataSourceOperations[dataSourceName];
            const recordValues = dsOperations.recordToViewValues(dataSourceName, record);
            const viewParams = dsParams[dataSource.name];
            const result:ni.GetViewRecord.res = {
                record: recordValues,
                referencedObjects: viewParams.referencedObjectsOnView
            };
            res.json(result);   
        } catch(err) {
            ControllerUtils.getErrorFunc(res, 500, "Erro")(err);
        }
        return null;
    })
    return null;
    };
}

export function getRecord(req: express.Request, res: express.Response, next) {Sync(function(){
    const query:ni.GetRecord.req = req.query;
    const recordOptions:IGetRecordOptions = getRecordOptions[query.optionsName];
    const record = await( recordOptions.model.findById(query.id, recordOptions.seqOptions) );
    const result:ni.GetRecord.res = { record };
    res.json(result);
}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar o registro."))}

/**
 * Get objects filtered by another object. It's used to show subqueries,
 * or objects associated with a given object
 */
export function getQueryData(req: express.Request, res: express.Response) {Sync(function(){
    const query: ni.GetQueryData.req = req.query;
    const queryName = query.queryName;
    const filters = query.filters;
    const queryById = QueriesById[queryName];
    const queryStr = queryById.queryStrFn(filters);
    const simpleQueryType = { type: db.Sequelize.QueryTypes.SELECT};
    db.sequelize.query(queryStr, simpleQueryType).then( (records) => {
        const result = {
            fields: queryById.fields,
            records: records
        };
        res.json(result);
    }).catch(ControllerUtils.getErrorFunc(res, 500, "Erro"));
}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os registros."))}

/**
 * Get the list of all the objects of a type, with pagination and
 * custom user filters
 */
export function getTableQueryData(req: express.Request, res: express.Response):void {Sync(function(){
    const queryParams:QueryGenerator.IQueryParams = req.query.queryParams;
    queryParams.filters = queryParams.filters ? queryParams.filters : [];
    const queryName:string = req.query.queryName;
    const query = TableQueries.queries[queryName];
    const fields = query.fields;

    TableQueries.getQueryResult(queryName, queryParams).then( (results) => {
        const records = results[0];
        if(query.recordProcessor) {
            for(var record of records) {
                query.recordProcessor(record);
            }
        }
        const result:interfaces.TableQueryDataRes = {
            fields,
            records,
            count: results[1][0].count
        };
        res.json(result);
    }).catch(ControllerUtils.getErrorFunc(res, 500, "Erro"));

}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os registros."))}
 
export function getTimeSeries(req: express.Request, res: express.Response):void {Sync(function(){
    const queryParams = req.query.queryParams;
    const queryName:string = req.query.queryName;

    TimeSeriesQueries.getData(queryName, queryParams).then( (results) => {
        const result = {
            records: results
        };
        res.json(result);
    }).catch(ControllerUtils.getErrorFunc(res, 500, "Erro"));
}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados."))}

export function getDashboardData(req: express.Request, res: express.Response):void {Sync(function(){
    const projQueryParams:QueryGenerator.IQueryParams = {
        order: [],
        filters: [],
        pagination: {
            first: 0,
            itemsPerPage: 1
        }
    }
    const projectsInfo = await( TableQueries.getQueryResult('Projects', projQueryParams) );

    const dashboardData:ni.GetDashboardData.res = {
        numBids: await( db.models.Bid.count() ),
        numContracts: await( db.models.Contract.count() ),
        numPersons: await( db.models.Person.count() ),
        numProjects: projectsInfo[1][0].count
    }
    res.json(dashboardData);
}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados."))}

export function getTableQueriesFields(req: express.Request, res: express.Response):void {Sync(function(){
    const result:ni.GetTableQueriesFields.res = {};
    for(var queryName in TableQueries.queries) {
        result[queryName] = TableQueries.queries[queryName].fields;
    }
    res.json(result);
}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados."))}
