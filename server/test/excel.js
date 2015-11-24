var fiberTests = require('./lib/fiberTests');
var db = require('../db/models');
var await = require('../lib/await');
var fs = require('fs');
var importExcel = require('../lib/importExcel');

var group = {

first: function(test) {
    var fixtureCount = 3;
    test.equal( fixtureCount, await( db.DrillingRig.findAndCountAll() ).count );  
    var excelBuf = fs.readFileSync('./test/data/drilling_rigs.xls');
    try {
        importExcel(excelBuf, 'DrillingRig', onImportDone);
    } catch(err) {
        console.log(err);
    }
    
    function onImportDone() {
        test.equal( 98, await( db.DrillingRig.findAndCountAll() ).count );  
        test.done();
    }
},


};

fiberTests.convertTests( exports, group );