var db = require( '../models' );
var await = require('../../lib/await');
var Umzug = require('umzug');
var Sync = require('sync');
var createFixtures = require('../../test/fixtures/initial_data');

var umzug = new Umzug({
	migrations: {
		path: __dirname + '/../../db/migrations',
		params: [db.sequelize.getQueryInterface(), db.Sequelize]
	}
});

Sync(function() {
    try {
        await( umzug.down() );
        await( umzug.up() );
        createFixtures();
    } catch(e) {
        console.error(e.stack);
    }
});