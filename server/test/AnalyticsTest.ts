"use strict"

import fiberTests = require('./lib/fiberTests');
import nodeunit = require('nodeunit');
import * as Analytics from '../lib/Analytics';
import * as Interfaces from '../../common/Interfaces';
import * as libAwait from '../lib/await';
import * as utils from './lib/utils';


var notModGroup: nodeunit.ITestGroup = {

getSources: (test: nodeunit.Test) => {
    const sources = Analytics.getSources();
    test.equal(11, sources.length);
    test.equal('Sondas', sources[0].label);
    test.equal('Contratante', sources[0].groupFields[0].label);
    test.done();
},

getCount: async function(test: nodeunit.Test) {
    const result = await Analytics.getResult('FPSOs', 'op_name', 'qtt*');
    test.equal(2, result.items.length);
    test.equal('Petrobras', result.items[0].label);
    test.equal(4, result.items[0].value);
    test.equal(0, result.othersValue);
    test.done();
},

getSum: async function(test: nodeunit.Test) {
    const result = await Analytics.getResult('Contracts', 'type', 'value');
    test.equal(4, result.items.length);
    test.equal('CAPEX', result.items[1].label);
    test.equal(43707266.86, result.items[1].value);
    test.equal(0, result.othersValue);
    test.done();
},

}

exports.notModDBGroup = fiberTests.convertTests( notModGroup, true );