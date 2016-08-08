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
    const insightsRecentOpts = {
        limit: 5,
        order: [['created_at', 'DESC']],
        include: [{
            model: db.models.User,
            as: 'author',
            attributes: ['name']
        }]
    };
    const recentInsights = await( db.models.News.findAll(insightsRecentOpts) );
    const recentInsightsRes:Interfaces.IInsight[] = recentInsights.map((insight) => {
        return {
            id: insight.id,
            title: insight.title, 
            content: insight.content,
            author: insight.author.name,
            imgUrl: 'temp.jpg',
            date: insight.created_at
        }
    });

    const flexSliderOpts = {
        attributes: [],
        include: [{
            model: db.models.News, 
            as: 'insight',
            attributes: [
                'id',
                'title',
                'content',
                'created_at'
            ],
            include: [{
                model: db.models.User,
                as: 'author',
                attributes: ['name']
            }]
        }],
        order: ['order'],
        where: { section: 'flexSlider' }
    };
    const flexSliderInsights = await( db.models.InsightsPublisher.findAll(flexSliderOpts) );
    const flInsightsRes:Interfaces.IInsight[] = flexSliderInsights.map((insight) => {
        return {
            id: insight.insight.id,
            title: insight.insight.title, 
            content: insight.insight.content,
            author: insight.insight.author.name,
            imgUrl: 'temp.jpg',
            date: insight.insight.created_at
        }
    });

    const insightsRes:ni.Insights.res = {
        section1Articles: recentInsightsRes,
        section2Articles: recentInsightsRes,
        section3Articles: recentInsightsRes,
        section4Articles: recentInsightsRes,
        popular: recentInsightsRes,
        recent: recentInsightsRes,
        flexSlider: flInsightsRes,
    };
    res.json(insightsRes); 
}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados."))}

/**
 * Save the publisher options
 */
export function saveInsights(req: express.Request, res: express.Response, next) {Sync(function(){
    const query:ni.SaveInsights.req = req.query;
    const InsightsPublisher = db.models.InsightsPublisher;

    const sections = [
        { items: query.flexSlider, name: 'flexSlider'},
        { items: query.section1Articles, name: 'section1Articles'},
        { items: query.section2Articles, name: 'section2Articles'},
        { items: query.section3Articles, name: 'section3Articles'},
        { items: query.section4Articles, name: 'section4Articles'},
    ];

    const recordItems = [];
    for(var section of sections) {
        section.items.map((insight_id, index) => {
            recordItems.push({
                order: index,
                section: section.name,
                insight_id
            });
        });
    }

	db.sequelize.transaction(function(t: Sequelize.Transaction) {
        // option to destroy all items
        const destroyOptions = { where: { id: { $gte: 0 } } };
        return InsightsPublisher.destroy(destroyOptions).then(() => {
            return InsightsPublisher.bulkCreate(recordItems);
        }).then(() => {
            res.json({message: 'OK'});
        });       
    });
}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados."))}