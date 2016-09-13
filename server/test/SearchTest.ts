"use strict"

import fiberTests = require('./lib/fiberTests');
import nodeunit = require('nodeunit');
import { initializeSearch, searchLike, searchEqual } from '../lib/search';
import { syncify } from '../lib/PromiseUtils';
import { await } from '../lib/await';

var group: nodeunit.ITestGroup = {

searchLike:  (test: nodeunit.Test) => {
    await( syncify( initializeSearch ) );
    const result:any[] = await( searchLike('Guilherme', 5) );
    test.equal(1, result.length);
    test.equal('Guilherme Stiebler', result[0].name);
    test.done();
},
    
searchEqual:  (test: nodeunit.Test) => {
    await( syncify( initializeSearch ) );
    const resultAbalone:any[] = await( searchEqual('Abalone', 1) );
    test.equal(1, resultAbalone.length);
    test.equal('Abalone', resultAbalone[0].name);
    test.equal('OilField', resultAbalone[0].model);
    //test.equal(10, resultAbalone[0].model_id);
    //test.equal(3, resultAbalone[0].id);

    const resultEmpty:any[] = await( searchEqual('Aba', 1) );
    test.equal(0, resultEmpty.length);

    test.done();
},

}

exports.group = fiberTests.convertTests( group, true );