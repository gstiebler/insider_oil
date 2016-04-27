var fiberTests = require('./lib/fiberTests');
var utils = require('./lib/utils');
import TableQueries = require('../db/queries/TableQueries');
import nodeunit = require('nodeunit');
import dbServerController = require('../controllers/dbServerController');

var group: nodeunit.ITestGroup = {


basinsLikeFilter:  (test: nodeunit.Test) => {
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
    test.equal( 4, resQueryValues.count );
    test.equal( 'Alagoas', resQueryValues.records[0].name );
    test.equal( 'Almada', resQueryValues.records[1].name );
    
    test.done();
},


basinsPagination:  (test: nodeunit.Test) => {
    const queryParams:TableQueries.IQueryParams = {
        order: ['name'],
        filters: [],
        pagination: {
            first: 10,
            itemsPerPage: 5
        }
    }
    
    const reqQueryValues = {
        query: {
            queryName: 'Basins',
            queryParams: JSON.stringify(queryParams)
        }
    }; 
    
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getTableQueryData, reqQueryValues);
    test.equal( 5, resQueryValues.records.length );
    test.equal( 25, resQueryValues.count );
    test.equal( 'Jequitinhonha', resQueryValues.records[0].name );
    test.equal( 'Pará - Maranhão', resQueryValues.records[1].name );
    test.equal( 'Paraná', resQueryValues.records[2].name );
    test.equal( 'Parecis - Alto Xingu', resQueryValues.records[3].name );
    test.equal( 'Parnaíba', resQueryValues.records[4].name );
    
    test.done();
},


blocksInFilter:  (test: nodeunit.Test) => {
    const queryParams:TableQueries.IQueryParams = {
        order: ['basin_name', 'block_name'],
        filters: [
            {
                field: 'operator_id',
                in: [
                    utils.idByName('Company', 'Petrobras'),
                    utils.idByName('Company', 'Statoil')
                ]
            }
        ],
        pagination: {
            first: 0,
            itemsPerPage: 10
        }
    }
    
    const reqQueryValues = {
        query: {
            queryName: 'Blocks',
            queryParams: JSON.stringify(queryParams)
        }
    }; 
    
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getTableQueryData, reqQueryValues);
    test.equal( 2, resQueryValues.records.length );
    test.equal( 2, resQueryValues.count );
    test.equal( 'ES-M-529', resQueryValues.records[0].block_name );
    test.equal( 'Statoil', resQueryValues.records[0].operator_name );
    test.equal( 'BM-BAR-1', resQueryValues.records[1].block_name );
    test.equal( 'Petrobras', resQueryValues.records[1].operator_name );
    
    test.done();
}
    
}

 

fiberTests.convertTests( exports, group, true );