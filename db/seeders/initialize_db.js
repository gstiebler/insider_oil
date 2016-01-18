var db = require( '../models' );

var Sync = require('sync');
var createFixtures = require('../../test/fixtures/initial_data');

Sync(function() {
    try {
        createFixtures();
    } catch(e) {
        console.error(e.stack);
    }
});