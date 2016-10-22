'use strict';

import db = require('../db/models');
import * as Sequelize from 'sequelize';
import * as Interfaces from '../../common/Interfaces';
import * as ni from '../../common/NetworkInterfaces';
import * as express from "express";
import * as ControllerUtils from '../lib/ControllerUtils';
import * as Analytics from '../lib/Analytics';

export function getSources(req: express.Request, res: express.Response, next) { try {
    const resObj:ni.AnalyticsSources.res = { sources: Analytics.getSources() };
    res.json(resObj);
} catch(err) { ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados.")(err); } }

export async function getCountValues(req: express.Request, res: express.Response, next) { try {
    const query:ni.AnalyticsResults.req = req.query;
    const result:Interfaces.NSAnalytics.IResult = 
        await Analytics.getResult(query.source, query.groupField, query.valueField, query.maxNumItems);
    const resObj:ni.AnalyticsResults.res = { result };
    res.json(resObj);
} catch(err) { ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados.")(err); } }