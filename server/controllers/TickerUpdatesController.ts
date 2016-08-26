'use strict';

import db = require('../db/models');
import * as Sequelize from 'sequelize';
import * as ni from '../../common/NetworkInterfaces';
import * as express from "express";
import * as ControllerUtils from '../lib/ControllerUtils';
var Sync = require('sync');
var await = require('../lib/await');


export function getUpdates(req: express.Request, res: express.Response, next) {Sync(function(){
    const items:ni.TickerUpdates.ITickerItem[] = [
        {
            category: 'E&P',
            title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
            link: '/app/view_new?id=1'
        },
        {
            category: 'E&P',
            title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
            link: '/app/view_new?id=1'
        },
        {
            category: 'E&P',
            title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
            link: '/app/view_new?id=1'
        },
    ];
    const resObj: ni.TickerUpdates.res = { items };
    res.json(resObj);
}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados."))}