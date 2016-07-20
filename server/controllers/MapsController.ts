'use strict';
import db = require('../db/models');
import express = require("express");
import * as ControllerUtils from '../lib/ControllerUtils';
import * as ni from '../../common/NetworkInterfaces';
var Sync = require('sync');
var await = require('../lib/await');

/**
 * Get blocks map data
 */
export function getBlocks(req: express.Request, res: express.Response):void {Sync(function(){
    const blockGetAllOptions = {
        attributes: ['id', 'name', 'polygons']
    }
    const blocks = await( db.models.Block.findAll(blockGetAllOptions) );

    res.json( { blocks } );
}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados."))}

/**
 * Get oil fields map data
 */
export function getOilFields(req: express.Request, res: express.Response):void {Sync(function(){
    const oilFieldGetAllOptions = {
        attributes: ['id', 'name', 'polygons'],
        where: { polygons: { $ne: null } }
    }
    const oilFields = await( db.models.OilField.findAll(oilFieldGetAllOptions) );

    res.json( { oilFields } );
}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados."))}

/**
 * Get production units map data
 */
export function getProductionUnits(req: express.Request, res: express.Response):void {Sync(function(){
    const productionUnitsGetAllOptions = {
        attributes: ['id', 'name', 'coordinates'],
        where: { coordinates: { $ne: null } }
    }
    const productionUnits = await( db.models.ProductionUnit.findAll(productionUnitsGetAllOptions) );

    res.json( { productionUnits } );
}, ControllerUtils.getErrorFunc(res, 500, "Não foi possível recuperar os dados."))}