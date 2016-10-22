"use strict"

import fiberTests = require('./lib/fiberTests');
import nodeunit = require('nodeunit');
import * as Analytics from '../lib/Analytics';
import * as Interfaces from '../../common/Interfaces';
import * as libAwait from '../lib/await';
var utils = require('./lib/utils');


var notModGroup: nodeunit.ITestGroup = {

getSources: (test: nodeunit.Test) => {
    const sources = Analytics.getSources();
    console.log(sources);
    test.done();
},

}

exports.notModDBGroup = fiberTests.convertTests( notModGroup, true );