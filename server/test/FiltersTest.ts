
import * as nodeunit from 'nodeunit';
import fiberTests = require('./lib/fiberTests');
import * as Filters from '../lib/Filters';

var notModGroup: nodeunit.ITestGroup = {

first: (test: nodeunit.Test) => {
    const results = Filters.getFilterResult('DrillingRigs', 'contractor_name');
    test.equal(2, results.length);
    test.equal('Petrobras', results[0].value);
    test.equal(4, results[0].qtt);
    test.done();
}

}

exports.notModDBGroup = fiberTests.convertTests( notModGroup, true );