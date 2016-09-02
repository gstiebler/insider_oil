import db = require( '../models' );
var umzug = require('../../lib/InitUmzug');
var Sync = require('sync');
import winston = require('winston');
import createFixtures = require('../../test/fixtures/initial_data');
import { await } from '../../lib/await';

winston.add(winston.transports.File, { filename: 'log/seeder.log' });

Sync(function() {
    if(process.env.NODE_ENV == 'production') {
        console.log('Production environment not allowed!!');
        return;
    }
    try {
        await( db.sequelize.getQueryInterface().dropAllTables() );
        await( umzug.up() );
        createFixtures.createFixtures();
    } catch(e) {
        winston.error(e.errors);
        winston.error(e.stack);
    }
});