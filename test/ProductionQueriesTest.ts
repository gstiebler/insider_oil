"use strict"

import fiberTests = require('./lib/fiberTests');
var utils = require('./lib/utils');
import nodeunit = require('nodeunit');
import dbServerController = require('../controllers/dbServerController');

var group: nodeunit.ITestGroup = {

byField:  (test: nodeunit.Test) => {
    const jiritubaId = utils.idByName('OilField', 'Jiribatuba2');
    const queryParams = {
        oilField: jiritubaId   
    };
    const reqQueryValues = {
        query: { 
            queryName: 'byField',
            queryParams: JSON.stringify(queryParams)
        }
    };
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getProduction, reqQueryValues);
    console.log(resQueryValues.records);
    test.equal(4, resQueryValues.records.length);

    test.done();
},

}

exports.group = fiberTests.convertTests( group, true );