import fiberTests = require('./lib/fiberTests');
var utils = require('./lib/utils');
import QueryGenerator = require('../db/queries/QueryGenerator');
import nodeunit = require('nodeunit');
import dbServerController = require('../controllers/dbServerController');
import { IQueryParams } from '../../common/Interfaces';
import { queries } from '../db/queries/TableQueries';

var group: nodeunit.ITestGroup = {

basinsLikeFilter:  (test: nodeunit.Test) => {
    const queryParams:IQueryParams = {
        order: [
            {
                fieldName: 'name',
                dir: 'asc'
            }
        ],
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
            queryParams: queryParams
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
    const queryParams:IQueryParams = {
        order: [
            {
                fieldName: 'name',
                dir: 'asc'
            }
        ],
        filters: [],
        pagination: {
            first: 10,
            itemsPerPage: 5
        }
    }
    
    const reqQueryValues = {
        query: {
            queryName: 'Basins',
            queryParams: queryParams
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

contracts:  (test: nodeunit.Test) => {
    const queryParams:IQueryParams = {
        order: [
            {
                fieldName: 'start',
                dir: 'desc'
            }
        ],
        filters: [],
        pagination: {
            first: 0,
            itemsPerPage: 5
        }
    }
    
    const reqQueryValues = {
        query: {
            queryName: 'Contracts',
            queryParams: queryParams
        }
    }; 
    
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getTableQueryData, reqQueryValues);
    test.equal( 5, resQueryValues.records.length );
    test.equal( 5, resQueryValues.count );
    {
        const record = resQueryValues.records[0];
        test.equal( 'SERVIÇOS DE PROJETO, CONSTRUÇÃO E MONTAGEM DO SISTEMA DE COM', record.c_contract_object );
        test.equal( 22, record.duration );
        test.equal( 797913.170909091, record.day_rate );
    }

    test.equal( null, resQueryValues.records[1].day_rate );
    
    test.done();
},

DrillingRigs:  (test: nodeunit.Test) => {
    const queryParams:IQueryParams = {
        order: [
            {
                fieldName: 'dr_name',
                dir: 'asc'
            }
        ],
        filters: [{
            field: 'land_sea',
            like: 'ma'
        }],
        pagination: {
            first: 0,
            itemsPerPage: 5
        }
    }
    
    const reqQueryValues = {
        query: {
            queryName: 'DrillingRigs',
            queryParams: queryParams
        }
    }; 
    
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getTableQueryData, reqQueryValues);
    test.equal( 3, resQueryValues.records.length );
    
    test.done();
},

blocksInFilter:  (test: nodeunit.Test) => {
    const queryParams:IQueryParams = {
        order: [
            {
                fieldName: 'basin_name',
                dir: 'desc'
            },
            {
                fieldName: 'block_name',
                dir: 'asc'
            }
        ],
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
            queryParams: queryParams
        }
    }; 
    
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getTableQueryData, reqQueryValues);
    test.equal( 2, resQueryValues.records.length );
    test.equal( 2, resQueryValues.count );
    
    test.equal( 'BM-BAR-1', resQueryValues.records[0].block_name );
    test.equal( 'Petrobras', resQueryValues.records[0].operator_name );
    test.equal( 'Recôncavo', resQueryValues.records[0].basin_name );
    
    test.equal( 'ES-M-529', resQueryValues.records[1].block_name );
    test.equal( 'Statoil', resQueryValues.records[1].operator_name );
    test.equal( 'Potiguar', resQueryValues.records[1].basin_name );
    
    test.done();
},

companies:  (test: nodeunit.Test) => {
    const queryParams:IQueryParams = {
        order: [
            {
                fieldName: 'name',
                dir: 'asc'
            }
        ],
        filters: [],
        pagination: {
            first: 0,
            itemsPerPage: 5
        }
    }
    
    const reqQueryValues = {
        query: {
            queryName: 'Companies',
            queryParams: queryParams
        }
    }; 
    
    const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getTableQueryData, reqQueryValues);
    test.equal( 5, resQueryValues.records.length );
    test.equal( 46, resQueryValues.count );
    test.equal( 'Gás, Petróleo', resQueryValues.records[0].segments_text );
    
    test.done();
},

all: (test: nodeunit.Test) => {
    for(var queryName in queries) {
        try {
            const query = queries[queryName];
            const queryParams:IQueryParams = {
                order: [],
                filters: [],
                pagination: {
                    first: 0,
                    itemsPerPage: 5
                }
            }
            
            const reqQueryValues = {
                query: {
                    queryName,
                    queryParams
                }
            }; 
            
            const resQueryValues = utils.getJsonResponse.sync(null, dbServerController.getTableQueryData, reqQueryValues);
            const resCount = resQueryValues.records.length;
            test.ok(resCount >= 2, 'Error on ' + queryName + ' count = ' + resCount);
        } catch(err) {
            test.ok(false, queryName + ': ' + err);
        }
    }
    test.done();
},
    
}

exports.group = fiberTests.convertTests( group, true );