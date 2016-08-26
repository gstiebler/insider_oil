"use strict"

import fiberTests = require('./lib/fiberTests');
import db = require('../db/models');
import * as nodeunit from 'nodeunit';
import * as TickerUpdatesController from  '../controllers/TickerUpdatesController';
import * as ni from '../../common/NetworkInterfaces';
var await = require('../lib/await');
var utils = require('./lib/utils');


var notModGroup: nodeunit.ITestGroup = {

get: (test: nodeunit.Test) => {
	const req:ni.TickerUpdates.req = {}
    const tickerResults:ni.TickerUpdates.res = 
        utils.getJsonResponse.sync(null, TickerUpdatesController.getUpdates, req);
    test.equal(3, tickerResults.items.length);
    test.equal('Atualização', tickerResults.items[0].category);
    test.equal('Ataulfo Alves: Porte Bruto (DWT), Ano de construção', tickerResults.items[0].title);
    test.done();
}

}

exports.notModDBGroup = fiberTests.convertTests( notModGroup, true );