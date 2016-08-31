"use strict"

import fiberTests = require('./lib/fiberTests');
import nodeunit = require('nodeunit');
import * as Analytics from '../lib/Analytics';
var await = require('../lib/await');
var utils = require('./lib/utils');


var notModGroup: nodeunit.ITestGroup = {

getCount: (test) => {
    const result:any[] = await( Analytics.getCount('Well', 'operator_id') ); 
    test.equal(3, result.length);
    test.equal('Petrobras', result[0].name);
    test.equal(3, result[0].contador, 'qtd petrobras');
    test.equal('Eni Oil', result[2].name);
    test.equal(1, result[2].contador, 'qtd Eni Oil');
    test.done();
}

}

exports.notModDBGroup = fiberTests.convertTests( notModGroup, true );