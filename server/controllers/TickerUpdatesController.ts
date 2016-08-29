'use strict';

import db = require('../db/models');
import * as Sequelize from 'sequelize';
import * as ni from '../../common/NetworkInterfaces';
import * as express from "express";
import * as ControllerUtils from '../lib/ControllerUtils';
import dsParams = require('../lib/DataSourcesParams');
var Sync = require('sync');
var await = require('../lib/await');


export function getUpdates(req: express.Request, res: express.Response, next) {Sync(function(){
    const searchOpts = {
        order: [['created_at', 'DESC']],
        limit: 10
    };
    const items:ni.TickerUpdates.ITickerItem[] = [];
    const updates = await( db.models.UpdateLog.findAll(searchOpts) );
    for(let update of updates) {
        const params = dsParams[update.model];
        const record = await( db.models[update.model].findById(update.obj_id) );
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
        title += updatedFieldLabels.join(', ');
        const link = '/app/view_record?source=' + update.model + '&id=' + update.obj_id;
        items.push({
            category: 'Atualização',
            title,
            link
        });
    }

    const resObj: ni.TickerUpdates.res = { items };
    res.json(resObj);
}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados."))}