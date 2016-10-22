'use strict';

import db = require('../db/models');
import * as Sequelize from 'sequelize';
import * as Interfaces from '../../common/Interfaces';
import * as ni from '../../common/NetworkInterfaces';
import * as express from "express";
import * as ControllerUtils from '../lib/ControllerUtils';
import * as Analytics from '../lib/Analytics';

export function getSources(req: express.Request, res: express.Response, next) {Sync(function(){
    const resObj:ni.AnalyticsSources.res = { sources: Analytics.getSources() };
    res.json(resObj);
}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados."))}

export function getCountValues(req: express.Request, res: express.Response, next) {Sync(function(){
    const query:ni.AnalyticsResults.req = req.query;
    const countResult:Interfaces.IAnalyticsCount[] = 
            await( Analytics.getCount(query.source, query.field) );
    const resObj:ni.AnalyticsResults.res = { results };
    res.json(resObj);
}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados."))}