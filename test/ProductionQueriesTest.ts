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
    //console.log(resQueryValues.records);
    test.equal(4, resQueryValues.records.length);
    test.equal( '07/2014', resQueryValues.records[0].date_prod);
    test.equal( '08/2014', resQueryValues.records[1].date_prod);
    test.equal( '07/2015', resQueryValues.records[2].date_prod);
    test.equal( '08/2015', resQueryValues.records[3].date_prod);
    
    test.equal( 3.213399887084961, resQueryValues.records[0].oil_production);
    test.equal( 0.9700000286102295, resQueryValues.records[0].oil_condensed_production);
    test.equal( 189484, resQueryValues.records[0].gas_associated_production);
    test.equal( 487, resQueryValues.records[0].gas_non_associated_production);

    test.done();
},

}

exports.group = fiberTests.convertTests( group, true );