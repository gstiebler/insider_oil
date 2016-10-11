'use strict';

import db = require('../db/models');
import * as Sequelize from 'sequelize';
import * as ni from '../../common/NetworkInterfaces';
import * as express from "express";
import * as ControllerUtils from '../lib/ControllerUtils';
import dsParams = require('../lib/DataSourcesParams');
import QueryGenerator = require('../db/queries/QueryGenerator');
var Sync = require('sync');
import { await } from '../lib/await';

interface ITickerRecord {
    model: string;
    obj_id: number;
    type: string;
    updates: string;
}

function getUpdateRecords():any[] {
    const updatesOpts:QueryGenerator.IQueryOpts = {
        table: {
            name: 'updates_log',
            fields: [
                'obj_id',
                'updates',
                'created_at',
                'model',
            ]
        },
        joinTables: [],
        extraFields: [
            ['"UPDATE"', 'type']
        ],
        where: [],
        order: [],
    };

    const insightsOpts:QueryGenerator.IQueryOpts = {
        table: {
            name: 'news',
            fields: [
                ['id', 'obj_id'],
                ['title', 'updates'],
                'created_at',
            ]
        },
        joinTables: [],
        extraFields: [
            ['"News"', 'model'],
            ['"INSIGHT"', 'type'],
        ],
        where: [],
        order: [],
    };

    const simpleQueryType = { type: db.sequelize.QueryTypes.SELECT };

    const updatesQueryStr = QueryGenerator.generate(updatesOpts);
    const insightsQueryStr = QueryGenerator.generate(insightsOpts);
    const orderStr = ' order by created_at desc ';
    const limitStr = ' limit 10 ';
    const queryStr = updatesQueryStr + ' union ' + insightsQueryStr + orderStr + limitStr;
    return await( db.sequelize.query(queryStr, simpleQueryType) );
}

function getUpdateTickerItem(update: ITickerRecord):ni.TickerUpdates.ITickerItem {
    const params = dsParams[update.model];
    const record = await( db.models[update.model].findById(update.obj_id) );
    if(!record) return null;
    const objLabel = record[params.labelField];
    let title = params.labelSingular + ' ' + objLabel + ': ';
    const updatedFields = JSON.parse(update.updates);
    const updatedFieldLabels:string[] = [];
    for(let updatedField of updatedFields) {
        // continue if the field is not found on data source params
        if(!params.fields[updatedField]) continue;
        let label = params.fields[updatedField].label;
        // do not include admin fields
        if(label.indexOf('admin') > -1) continue;
        updatedFieldLabels.push(label);
    }
    if(updatedFieldLabels.length == 0) {
        return null;
    }
    title += updatedFieldLabels.join(', ');
    const link = '/app/view_record?source=' + update.model + '&id=' + update.obj_id;
    return {
        category: 'Atualização',
        title,
        link
    };
}


function getInsightTickerItem(update: ITickerRecord):ni.TickerUpdates.ITickerItem {
    const insight = await( db.models.News.findById(update.obj_id) );
    const title = update.updates;
    const link = '/app/view_new?id=' + update.obj_id;
    return {
        category: 'Insight',
        title,
        link
    };
}

export function getUpdates(req: express.Request, res: express.Response, next) {Sync(function(){
    const updates = getUpdateRecords();
    const items:ni.TickerUpdates.ITickerItem[] = [];
    for(let update of updates) {
        if(update.type == 'UPDATE') {
            const item = getUpdateTickerItem(update);
            if(item) {
                items.push(item);
            }
        } else if(update.type == 'INSIGHT') {
            const item = getInsightTickerItem(update);
            items.push(item);
        } else {
            throw 'tipo não previsto';
        }
    }

    const resObj: ni.TickerUpdates.res = { items };
    res.json(resObj);

}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados."))}