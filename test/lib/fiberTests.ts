"use strict";

process.env['NODE_ENV'] = 'test';
import winston = require('winston');
import db = require('../../db/models');
import createFixtures = require('../fixtures/initial_data');

var Sync = require('sync');
var await = require('../../lib/await');
var umzug = require('../../lib/InitUmzug');

winston.level = 'debug';

process.on('uncaughtException', function (err) {
    winston.error(err.stack);
})

exports.initializeDB = function() {
    try {
        await( db.sequelize.getQueryInterface().dropAllTables() );
        await( umzug.up() );
        createFixtures.createFixtures();
    } catch(e) {
        winston.error(e.errors);
        winston.error(e.stack);
    }
}


function defaultSetUp(callback) {
    exports.initializeDB();
    callback();    
}


function showErrosOnCallback( test, callback ) {
    try {
        callback( test );
    } catch (e) {
        winston.error(e.stack);
    }
}


function syncBaseFunc( callback ) {
    var f = function(test) {
        Sync(function(){
            showErrosOnCallback( test, callback );
        });
    }
    return f;
}


exports.convertTests = function( exports, group ) {
    exports.group = {};
    exports.group.setUp = syncBaseFunc( defaultSetUp );
    for(var propertyName in group) {
        exports.group[propertyName] = syncBaseFunc( group[propertyName] );
    }
}