"use strict"

import fiberTests = require('./lib/fiberTests');
import nodeunit = require('nodeunit');
import * as Analytics from '../lib/Analytics';
import * as Interfaces from '../../common/Interfaces';
import * as libAwait from '../lib/await';
import * as utils from './lib/utils';
import winston = require('winston');


var notModGroup: nodeunit.ITestGroup = {

getSources: (test: nodeunit.Test) => {
    const sources = Analytics.getSources();
    test.equal(11, sources.length);
    test.equal('Sondas', sources[0].label);
    test.equal('Contratante', sources[0].groupFields[0].label);

    test.equal('Contratos', sources[9].label);
    test.equal('Quantidade', sources[9].valueFields[0].label);
    test.equal('qtt*', sources[9].valueFields[0].name);
    test.equal('Day rate', sources[9].valueFields[1].label);
    test.equal('day_rate', sources[9].valueFields[1].name);
    test.done();
},

getCount: async function(test: nodeunit.Test) {try {
    const result = await Analytics.getResult('FPSOs', 'op_name', 'qtt*', 10);
    test.equal(2, result.items.length);
    test.equal('Petrobras', result.items[0].label);
    test.equal(4, result.items[0].value);
    test.equal(0, result.othersValue);
    test.done();
} catch(err) { winston.error(err.stack) } },

getSum: async function(test: nodeunit.Test) { try {
    const result = await Analytics.getResult('Contracts', 'type', 'value', 3);
    test.equal(3, result.items.length);
    test.equal('CAPEX', result.items[1].label);
    test.equal(43707266.86, result.items[1].value);
    test.equal(17554089.75999999, result.othersValue);
    test.done();
} catch(err) { winston.error(err.stack) } },

others: async function(test: nodeunit.Test) { try {
    const result = await Analytics.getResult('DrillingRigs', 'type', 'qtt*', 2);
    test.equal(2, result.items.length);
    test.equal('NS', result.items[0].label);
    test.equal(3, result.items[0].value);
    test.equal(1, result.othersValue);
    test.done();
} catch(err) { winston.error(err.stack) } },

groupByDate: async function(test: nodeunit.Test) { try {
    const result = await Analytics.getResult('Wells', 'start', 'qtt*', 10);
    test.equal(3, result.items.length);
    test.equal(2012, result.items[0].label);
    test.equal(1, result.items[0].value);
    test.done();
} catch(err) { winston.error(err.stack) } },

groupByCurrency: async function(test: nodeunit.Test) { try {
    const result = await Analytics.getResult('DrillingRigs', 'day_rate', 'qtt*', 10);
    test.equal(4, result.items.length);

    test.equal(100000, result.items[0].label);
    test.equal(200000, result.items[1].label);
    test.equal(300000, result.items[2].label);
    test.equal(400000, result.items[3].label);

    test.equal(3, result.items[0].value);
    test.equal(0, result.items[1].value);
    test.equal(1, result.items[2].value);
    test.equal(2, result.items[3].value);
    test.done();
} catch(err) { winston.error(err.stack) } },

}

exports.notModDBGroup = fiberTests.convertTests( notModGroup, true );