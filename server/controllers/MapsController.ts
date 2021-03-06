'use strict';
import db = require('../db/models');
import express = require("express");
import * as ControllerUtils from '../lib/ControllerUtils';
import { GetItemsInsideMap } from '../../common/NetworkInterfaces';
import QueryGenerator = require('../db/queries/QueryGenerator');
import { execQuery, simpleQuery } from '../lib/dbUtils';
import { getItemsInsideArea } from '../lib/Maps';

/**
 * Get blocks map data
 */
export async function getBlocks(req: express.Request, res: express.Response) { try {
    const fields = ['id', 'name',  'polygons'];
    const blocks = await simpleQuery('blocks', fields);
    res.json( { blocks } );
} catch(err) { ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados.")(err) }}

/**
 * Get oil fields map data
 */
export async function getOilFields(req: express.Request, res: express.Response) { try {
    const options:QueryGenerator.IQueryOpts = {
        table: {
            name: 'oil_fields',
            fields: ['id', 'name', 'polygons']
        },
        extraFields: [],
        joinTables: [],
        where: [{
            field: 'polygons',
            isNotNull: true
        }],
        order: []
    };
    const oilFields = await execQuery(options);

    res.json( { oilFields } );
} catch(err) { ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados.")(err) }}

/**
 * Get production units map data
 */
export async function getProductionUnits(req: express.Request, res: express.Response) { try {
    const options:QueryGenerator.IQueryOpts = {
        table: {
            name: 'production_units',
            fields: ['id', 'name', 'coordinates']
        },
        extraFields: [],
        joinTables: [],
        where: [{
            field: 'coordinates',
            isNotNull: true
        }],
        order: []
    };
    const productionUnits = await execQuery(options);

    res.json( { productionUnits } );
} catch(err) { ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados.")(err) }}

export async function getWells(req: express.Request, res: express.Response) { try {
    const options:QueryGenerator.IQueryOpts = {
        table: {
            name: 'wells',
            fields: ['id', 'name', 'lat', 'lng']
        },
        extraFields: [],
        joinTables: [],
        where: [{
            field: 'lat',
            isNotNull: true
        }],
        order: []
    };
    const wells = await execQuery(options);
    const processedWells = wells.map((well) => {
        return {
            id: well.id,
            name: well.name,
            coordinates: {
                lat: well.lat,
                lng: well.lng
            }
        };
    });

    res.json( { wells: processedWells } );
} catch(err) { ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados.")(err) }}

export async function getDrillingRigs(req: express.Request, res: express.Response) { try {
    const optsDron:QueryGenerator.IQueryOpts = {
        table: {
            name: 'drilling_rigs_onshore',
            fields: ['id', 'name', 'coordinates']
        },
        extraFields: [],
        joinTables: [],
        where: [{
            field: 'coordinates',
            isNotNull: true
        }],
        order: []
    };
    const drillingRigsOnshore = await execQuery(optsDron);   

    const optsDroff:QueryGenerator.IQueryOpts = {
        table: {
            name: 'drilling_rigs_onshore',
            fields: ['id', 'name', 'coordinates']
        },
        extraFields: [],
        joinTables: [],
        where: [{
            field: 'coordinates',
            isNotNull: true
        }],
        order: []
    };
    const drillingRigsOffshore = await execQuery(optsDroff);  

    const allDrillingRigs = [];
    for(var dr of drillingRigsOnshore) {
        allDrillingRigs.push({
            type: 'onshore',
            id: dr.id,
            name: dr.name,
            coordinates: dr.coordinates
        });
    }
    for(var dr of drillingRigsOffshore) {
        allDrillingRigs.push({
            type: 'offshore',
            id: dr.id,
            name: dr.name,
            coordinates: dr.coordinates
        });
    }

    res.json( { drillingRigs: allDrillingRigs } );
} catch(err) { ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados.")(err) }}

export async function getItemsInsideMap(req: express.Request, res: express.Response) { try {
    const query: GetItemsInsideMap.req = req.query;
    const items = await getItemsInsideArea(query.geoLimits);
    const result: GetItemsInsideMap.res = { items };
    res.json( result );
} catch(err) { ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados.")(err) }}
