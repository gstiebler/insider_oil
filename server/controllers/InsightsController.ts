'use strict';

import db = require('../db/models');
import Sequelize = require('sequelize');
import * as ni from '../../common/NetworkInterfaces';
import * as Interfaces from '../../common/Interfaces';
import express = require("express");
import ControllerUtils = require('../lib/ControllerUtils');
var Sync = require('sync');
var await = require('../lib/await');

export function getInsights(req: express.Request, res: express.Response, next) {Sync(function(){
    const insightsOpts = {
        limit: 5,
        order: [['created_at', 'DESC']]
    };
    const insights = await( db.models.News.findAll(insightsOpts) );
    const newsDummy:Interfaces.IInsight[] = insights.map((insight) => {
        return {
            id: insight.id,
            title: insight.title, 
            content: insight.content,
            author: insight.author_id,
            imgUrl: 'temp.jpg',
            date: insight.created_at
        }
    });
    const insightsRes:ni.Insights.res = {
        carroussel: newsDummy,
        section1Articles: newsDummy,
        section2Articles: newsDummy,
        section3Articles: newsDummy,
        section4Articles: newsDummy,
        popular: newsDummy,
        recent: newsDummy,
        flexSlider: newsDummy,
    };
    res.json(insightsRes);
}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados."))}