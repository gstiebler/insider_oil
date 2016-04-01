var db = require( '../models' );
var await = require('../../lib/await');
var umzug = require('../../lib/InitUmzug');
var Sync = require('sync');
var createFixtures = require('../../test/fixtures/initial_data');
var winston = require('winston');

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