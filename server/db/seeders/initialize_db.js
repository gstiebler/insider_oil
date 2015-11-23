var db = require( '../models' );

var Sync = require('sync');
var createFixtures = require('../../test/fixtures/initial_data');

Sync( function() {
    await( db.sequelize.getQueryInterface().dropAllTables() );
    await( db.sequelize.sync() );
    createFixtures();
});