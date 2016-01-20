var db = require( '../models' );
var await = require('../../lib/await');
var Umzug = require('umzug');
var Sync = require('sync');
var createFixtures = require('../../test/fixtures/initial_data');

var umzug = new Umzug({
	migrations: {
		path: __dirname + '/../migrations',
		params: [db.sequelize.getQueryInterface(), db.Sequelize]
	}
});

Sync(function() {
    try {
        console.log( await( umzug.pending() ) );
        await( db.sequelize.getQueryInterface().dropAllTables() );
        //await( umzug.down() );
        console.log('up', __dirname + '/../migrations');
        await( umzug.up() );
        createFixtures();
    } catch(e) {
        console.error(e.stack);
    }
});