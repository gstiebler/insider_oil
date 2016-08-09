'use strict';

import db = require('../db/models');
import Sequelize = require('sequelize');
import * as ni from '../../common/NetworkInterfaces';
import * as Interfaces from '../../common/Interfaces';
import express = require("express");
import ControllerUtils = require('../lib/ControllerUtils');
var Sync = require('sync');
var await = require('../lib/await');

const sectionNames = {
    flexSlider: 'flexSlider',
    section1Articles: 'section1Articles',
    section2Articles: 'section2Articles',
    section3Articles: 'section3Articles',
    section4Articles: 'section4Articles',
}

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

    function getResInsights(sectionName: string):Interfaces.IInsight[] {
        const queryOpts = {
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
            where: { section: sectionName }
        };
        const insights = await( db.models.InsightsPublisher.findAll(queryOpts) );
        const insightsRes:Interfaces.IInsight[] = insights.map((insight) => {
            return {
                id: insight.insight.id,
                title: insight.insight.title, 
                content: insight.insight.content,
                author: insight.insight.author.name,
                imgUrl: 'temp.jpg',
                date: insight.insight.created_at
            }
        });

        return insightsRes;
    }

    const insightsRes:ni.Insights.res = {
        section1Articles: getResInsights(sectionNames.section1Articles),
        section2Articles: getResInsights(sectionNames.section2Articles),
        section3Articles: getResInsights(sectionNames.section3Articles),
        section4Articles: getResInsights(sectionNames.section4Articles),
        popular: recentInsightsRes,
        recent: recentInsightsRes,
        flexSlider: getResInsights(sectionNames.flexSlider),
    };
    res.json(insightsRes); 
}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados."))}

/**
 * Save the publisher options
 */
export function saveInsights(req: express.Request, res: express.Response, next) {Sync(function(){
    const body:ni.SaveInsights.req = JSON.parse(req.body);
    const InsightsPublisher = db.models.InsightsPublisher;

    const sections = [
        { items: body.flexSlider, name: sectionNames.flexSlider},
        { items: body.section1Articles, name: sectionNames.section1Articles},
        { items: body.section2Articles, name: sectionNames.section2Articles},
        { items: body.section3Articles, name: sectionNames.section3Articles},
        { items: body.section4Articles, name: sectionNames.section4Articles},
    ];

    const recordItems = [];
    for(var section of sections) {
        if(!section.items) continue;

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
            const response:ni.SaveInsights.res = { msg: 'OK' };
            res.json(response);
        });       
    });
}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados."))}