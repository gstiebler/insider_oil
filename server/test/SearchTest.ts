"use strict"

import fiberTests = require('./lib/fiberTests');
import nodeunit = require('nodeunit');
import search = require('../lib/search');
import { initializeSearch } from '../lib/search';
var await = require('../lib/await');

var group: nodeunit.ITestGroup = {

searchLike:  (test: nodeunit.Test) => {
    await( initializeSearch() );
    const result:any[] = await( search.searchLike('Guilherme', 5) );
    test.equal(1, result.length);
    test.equal('Guilherme Stiebler', result[0].name);
    test.done();
},
    
searchEqual:  (test: nodeunit.Test) => {
    await( initializeSearch() );
    const resultAbalone:any[] = await( search.searchEqual('Abalone', 1) );
    test.equal(1, resultAbalone.length);
    test.equal('Abalone', resultAbalone[0].name);
    test.equal('OilField', resultAbalone[0].model);
    //test.equal(10, resultAbalone[0].model_id);
    //test.equal(3, resultAbalone[0].id);

    const resultEmpty:any[] = await( search.searchEqual('Aba', 1) );
    test.equal(0, resultEmpty.length);

    test.done();
},

}

exports.group = fiberTests.convertTests( group, true );