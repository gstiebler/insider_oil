var fiberTests = require('./lib/fiberTests');
var db = require('../db/models');
var await = require('../lib/await');
var fs = require('fs');
var importExcel = require('../lib/importExcel');

var group = {

first: function(test) {
    test.equal( 7, 7 ); 
    var excelBuf = fs.readFileSync('./test/data/drilling_rigs.xls');
    importExcel(excelBuf);
    test.done();
},


};

fiberTests.convertTests( exports, group );