var fiberTests = require('./lib/fiberTests');
var utils = require('./lib/utils');
import TableQueries = require('../db/queries/TableQueries');
import nodeunit = require('nodeunit');
import dbServerController = require('../controllers/dbServerController');

var group: nodeunit.ITestGroup = {


basins:  (test: nodeunit.Test) => {
    const queryParams:TableQueries.IQueryParams = {
        order: ['name'],
        filters: [
            {
                field: 'name',
                like: 'al'
            }
        ],
        pagination: {
            first: 0,
            itemsPerPage: 10
        }
    }
    
    const reqQueryValues = {
        query: {
            queryName: 'Basins',
            queryParams: JSON.stringify(queryParams)
        }
    }; 
    
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getTableQueryData, reqQueryValues);
    test.equal( 4, resQueryValues.records.length );
    test.equal( 'Alagoas', resQueryValues.records[0].name );
    test.equal( 'Almada', resQueryValues.records[1].name );
    
    test.done();
}
    
}
 

fiberTests.convertTests( exports, group );