var db = require( '../db/models' );
var Umzug = require('umzug');

var umzug = new Umzug({
	storage: 'sequelize',
	storageOptions: {
		sequelize: db.sequelize
	},
	migrations: {
		path: __dirname + '/../db/migrations',
		params: [db.sequelize.getQueryInterface(), db.Sequelize]
	}
});

module.exports = umzug;