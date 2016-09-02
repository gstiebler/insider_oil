"use strict"

import fiberTests = require('./lib/fiberTests');
import nodeunit = require('nodeunit');
import * as Analytics from '../lib/Analytics';
import * as Interfaces from '../../common/Interfaces';
import { await } from '../lib/await';
var utils = require('./lib/utils');


var notModGroup: nodeunit.ITestGroup = {

getCount: (test) => {
    const result:Interfaces.IAnalyticsCount[] = 
            await( Analytics.getCount('Well', 'operator_id') ); 
    test.equal(3, result.length);
    test.equal('Petrobras', result[0].label);
    test.equal(3, result[0].count_value, 'qtd petrobras ' + result[0].count_value);
    test.equal('Eni Oil', result[2].label);
    test.equal(1, result[2].count_value, 'qtd Eni Oil' + result[1].count_value);
    test.done();
},

getCountTextField: (test) => {
    const result:Interfaces.IAnalyticsCount[] = 
            await( Analytics.getCount('Block', 'status') ); 
    test.equal(2, result.length);
    test.equal('SUSPENSO', result[0].label);
    test.equal(2, result[0].count_value);
    test.equal('PAD EM ANÁLISE', result[1].label);
    test.equal(1, result[1].count_value);
    test.done();
},

getCountEnumField: (test) => {
    const result:Interfaces.IAnalyticsCount[] = 
            await( Analytics.getCount('ProductionUnit', 'status') ); 
    test.equal(2, result.length);
    test.equal('Em projeto', result[0].label);
    test.equal(3, result[0].count_value);
    test.equal('Em construção', result[1].label);
    test.equal(1, result[1].count_value);
    test.done();
},

}

exports.notModDBGroup = fiberTests.convertTests( notModGroup, true );