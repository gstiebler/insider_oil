"use strict"

import fiberTests = require('./lib/fiberTests');
import nodeunit = require('nodeunit');
import * as MapsController from '../controllers/MapsController';
import * as ni from '../../common/NetworkInterfaces';
var utils = require('./lib/utils');


var notModDBGroup:nodeunit.ITestGroup = {

getBlocks: function(test) {
    const res = utils.getJsonResponse.sync(null, MapsController.getBlocks, {});
    test.equal(3, res.blocks.length);
    test.done();
},

getOilFields: function(test) {
    const res = utils.getJsonResponse.sync(null, MapsController.getOilFields, {});
    test.equal(0, res.oilFields.length, 'Tam. do vetor ' + res.oilFields.length);
    test.done();
},

getProductionUnits: function(test) {
    const res = utils.getJsonResponse.sync(null, MapsController.getProductionUnits, {});
    test.equal(1, res.productionUnits.length, 'Tam. do vetor ' + res.productionUnits.length);
    test.done();
},

getWells: function(test) {
    const res = utils.getJsonResponse.sync(null, MapsController.getWells, {});
    test.equal(3, res.wells.length, 'Tam. do vetor ' + res.wells.length);
    test.done();
},

}

exports.notModDBGroup = fiberTests.convertTests( notModDBGroup, true );
