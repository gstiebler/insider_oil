var db = require( '../models' );
var umzug = require('../../lib/InitUmzug');
var Sync = require('sync');
var winston = require('winston');
var createFixtures = require('../../test/fixtures/initial_data');
var await = require('../../lib/await');

winston.add(winston.transports.File, { filename: 'log/seeder.log' });

Sync(function() {
    try {
        await( db.sequelize.getQueryInterface().dropAllTables() );
        await( umzug.up() );
        createFixtures();
    } catch(e) {
        winston.error(e.errors);
        winston.error(e.stack);
    }
});