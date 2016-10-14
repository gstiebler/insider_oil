'use strict';

import db = require('../db/models');
var Sync = require('sync');
import * as libAwait from '../lib/await';
import ControllerUtils = require('../lib/ControllerUtils');
import winston = require('winston');
import dbUtils = require("../lib/dbUtils");
import dsParams = require('../lib/DataSourcesParams');
import express = require("express");
import DataSourceOperations = require('../lib/DataSourceOperations/index');
import * as QueriesById from '../db/queries/QueriesById';
import TableQueries = require('../db/queries/TableQueries');
import QueryGenerator = require('../db/queries/QueryGenerator');
import TimeSeriesQueries = require('../db/queries/TimeSeriesQueries');
import { IExcelUploadResponse } from '../lib/excel/ImportExcelClass';
import { getRecordOptions, IGetRecordOptions } from '../lib/GetRecordOptions';
import Sequelize = require('sequelize');
import * as interfaces from '../../common/Interfaces';
import * as ni from '../../common/NetworkInterfaces';
import { IQueryParams } from '../../common/Interfaces';

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

export function viewRecord(req: express.Request, res: express.Response, next) {Sync(function(){
    const query:ni.GetViewRecord.req = req.query;
    const dataSourceName = query.dataSource;
    const id = query.id;
    const dataSource = dbUtils.getDataSource(dataSourceName);
    const options: any = {};
    options.include = [{all: true}];
    const record = libAwait.await( dataSource.findById(id, options) );
    const dsOperations = DataSourceOperations[dataSourceName];
    const recordValues = dsOperations.recordToViewValues(dataSourceName, record);
    const viewParams = dsParams[dataSource.name];
    const result:ni.GetViewRecord.res = {
        record: recordValues,
        referencedObjects: viewParams.referencedObjectsOnView,
        extraRecordData: libAwait.await( dbUtils.loadExtraData(dataSourceName, id) ),
        updatedAt: record.updated_at
    };
    res.json(result);  
}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar o registro."))}

export function getRecord(req: express.Request, res: express.Response, next) {Sync(function(){
    const query:ni.GetRecord.req = req.query;
    const recordOptions:IGetRecordOptions = getRecordOptions[query.optionsName];
    const record = libAwait.await( recordOptions.model.findById(query.id, recordOptions.seqOptions) );
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
    const queryById = QueriesById.queries[queryName];
    const queryStr = queryById.queryStrFn(filters);
    const simpleQueryType = { type: db.Sequelize.QueryTypes.SELECT};
    db.sequelize.query(queryStr, simpleQueryType).then( (records) => {
        if(queryById.recordProcessor) {
            for(var record of records) {
                queryById.recordProcessor(record);
            }
        }
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
    const reqQuery:ni.GetTableQueryData.req = req.query;
    const queryParams:IQueryParams = reqQuery.queryParams;
    queryParams.filters = queryParams.filters ? queryParams.filters : [];
    const queryName:string = reqQuery.queryName;
    const query = TableQueries.queries[queryName];
    const fields = query.fields;

    const results = libAwait.await( TableQueries.getQueryResult(queryName, queryParams) );
    const records = results[0];
    if(query.recordProcessor) {
        for(var record of records) {
            query.recordProcessor(record);
        }
    }
    const result:ni.GetTableQueryData.res = {
        fields,
        records,
        count: results[1][0].count
    };
    res.json(result);
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
    const projQueryParams:IQueryParams = {
        order: [],
        filters: [],
        pagination: {
            first: 0,
            itemsPerPage: 1
        }
    }

    const dashboardData:ni.GetDashboardData.res = {
        numBids: libAwait.await( db.models.Bid.count() ),
        numContracts: libAwait.await( db.models.Contract.count() ),
        numPersons: libAwait.await( db.models.Person.count() ),
        numProjects: 0
    }
    res.json(dashboardData); 
}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados."))}

export function getTableQueriesFields(req: express.Request, res: express.Response):void {Sync(function(){
    const queryParams:ni.GetTableQueriesFields.req = req.query;
    const query = TableQueries.queries[queryParams.queryName];
    const result:ni.GetTableQueriesFields.res = {
        fields: [],
        title: query.title,
        tableauUrl: query.tableauUrl
    };
    //for(var queryName in TableQueries.queries) {
        result.fields = query.fields;
    //}
    res.json(result);
}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados."))}
