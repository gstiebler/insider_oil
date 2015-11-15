var db = require( '../models' );

var Sync = require('sync');
var insertInitialData = require('./initial_data');
var await = require('../../lib/await');

Sync( function() {
    await( db.sequelize.getQueryInterface().dropAllTables() );
    await( db.sequelize.sync() );
    insertInitialData();
});