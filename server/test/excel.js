var fiberTests = require('./lib/fiberTests');
var db = require('../db/models');
var await = require('../lib/await');

var group = {

first: function(test) {
    test.equal( 7, 7 ); 
    
    test.done();
},


};

fiberTests.convertTests( exports, group );