"use strict"

import fiberTests = require('./lib/fiberTests');
import nodeunit = require('nodeunit');
import * as MapsController from '../controllers/MapsController';
import { GetItemsInsideMap } from '../../common/NetworkInterfaces';
var utils = require('./lib/utils');


var notModDBGroup:nodeunit.ITestGroup = {

getBlocks: function(test) {
    const res = utils.getJsonResponse.sync(null, MapsController.getBlocks, {});
    test.equal(3, res.blocks.length);
    test.done();
},

getOilFields: function(test) {
    const res = utils.getJsonResponse.sync(null, MapsController.getOilFields, {});
    test.equal(1, res.oilFields.length, 'Tam. do vetor ' + res.oilFields.length);
    test.done();
},

getProductionUnits: function(test) {
    const res = utils.getJsonResponse.sync(null, MapsController.getProductionUnits, {});
    test.equal(9, res.productionUnits.length, 'Tam. do vetor ' + res.productionUnits.length);
    test.done();
},

getWells: function(test) {
    const res = utils.getJsonResponse.sync(null, MapsController.getWells, {});
    test.equal(3, res.wells.length, 'Tam. do vetor ' + res.wells.length);
    test.done();
},

getDrillingRigs: function(test) {
    const res = utils.getJsonResponse.sync(null, MapsController.getDrillingRigs, {});
    test.equal(6, res.drillingRigs.length, 'Tam. do vetor ' + res.drillingRigs.length);
    test.done();
},

getItemsInsideMap: function(test: nodeunit.Test) {
    const geoLimits: GetItemsInsideMap.IGeoLimits = {
        latMin: -42,
        latMax: -19,
        lngMin: -42,
        lngMax: -19
    }

    const query: GetItemsInsideMap.req = { geoLimits };
    const res: GetItemsInsideMap.res = 
        utils.getJsonResponse.sync(null, MapsController.getItemsInsideMap, { query });
    test.equal(10, res.items.length);
    {
        const item = res.items[0];
        test.equal('Capixaba', item.name);
        test.equal('ProductionUnit', item.model);
    }
    {
        const item = res.items[9];
        test.equal('Paragon DPDS3', item.name);
        test.equal('DrillingRigOffshore', item.model);
    }
    test.done();
},

}

exports.notModDBGroup = fiberTests.convertTests( notModDBGroup, true );
