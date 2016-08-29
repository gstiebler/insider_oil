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
    test.equal(6, tickerResults.items.length);

    test.equal('Insight', tickerResults.items[0].category);
    test.equal('Petrobrás é privatizada', tickerResults.items[0].title);
    test.equal('/app/view_new?id=3', tickerResults.items[0].link);

    test.equal('Atualização', tickerResults.items[4].category);
    test.equal('Navio Transpetro Ataulfo Alves: Porte Bruto (DWT), Ano de construção', 
            tickerResults.items[4].title);
    test.equal('/app/view_record?source=Fleet&id=1', tickerResults.items[4].link);

    test.done();
}

}

exports.notModDBGroup = fiberTests.convertTests( notModGroup, true );