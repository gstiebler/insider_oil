var db = require( '../models' );
var await = require('../../lib/await');
var Umzug = require('umzug');
var Sync = require('sync');
var createFixtures = require('../../test/fixtures/initial_data');
var winston = require('winston');

winston.add(winston.transports.File, { filename: 'log/seeder.log' });

var umzug = new Umzug({
	storage: 'sequelize',
	storageOptions: {
		sequelize: db.sequelize
	},
	migrations: {
		path: __dirname + '/../migrations',
		params: [db.sequelize.getQueryInterface(), db.Sequelize]
	}
});


Sync(function() {
    try {
        await( db.sequelize.getQueryInterface().dropAllTables() );
        await( umzug.up() );
        createFixtures();
    } catch(e) {
        console.error(e.stack);
    }
});