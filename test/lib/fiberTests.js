process.env['NODE_ENV'] = 'test';
var db = require('../../db/models');
var Sync = require('sync');
var createFixtures = require('../fixtures/initial_data');
var await = require('../../lib/await');
var Umzug = require('umzug');

var umzug = new Umzug({
	storage: 'sequelize',
	storageOptions: {
		sequelize: db.sequelize
	},
	migrations: {
		path: __dirname + '/../../db/migrations',
		params: [db.sequelize.getQueryInterface(), db.Sequelize]
	}
});

exports.initializeDB = function() {
	await( db.sequelize.getQueryInterface().dropAllTables() );
    await( umzug.up() );
    createFixtures();
}


function defaultSetUp(callback) {
    exports.initializeDB();
    callback();    
}


function showErrosOnCallback( test, callback ) {
    try {
        callback( test );
    } catch (e) {
        console.error(e.stack);
    }
}


function syncBaseFunc( callback ) {
    var f = function(test) {
        Sync(function(){
            showErrosOnCallback( test, callback );
        });
    }
    return f;
}


exports.convertTests = function( exports, group ) {
    exports.group = {};
    exports.group.setUp = syncBaseFunc( defaultSetUp );
    for(var propertyName in group) {
        exports.group[propertyName] = syncBaseFunc( group[propertyName] );
    }
}
