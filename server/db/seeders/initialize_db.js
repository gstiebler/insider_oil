var db = require( '../models' );

var Sync = require('sync');
var createFixtures = require('../../test/fixtures/initial_data');

db.sequelize.getQueryInterface().dropAllTables().then( function() {
    db.sequelize.sync().then(function() {
        Sync(function() {
            createFixtures();
        });
    });
});