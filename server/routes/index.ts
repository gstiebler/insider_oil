"use strict";

import session = require('../lib/session');
var mainController = require('../controllers/mainController');
import * as loginController from '../controllers/loginController';
import dbServerController = require('../controllers/dbServerController');
import * as usersController from '../controllers/usersController';
var treeController = require('../controllers/TreeController');
var searchController = require('../controllers/SearchController');
import ExcelController = require('../controllers/ExcelController');
var imageController = require('../controllers/ImageController');
import express = require("express");
import * as ni from '../../common/NetworkInterfaces';

module.exports = function(app: express.Express) {
    // Main route
    app.get('/', session.authorizeHTML, mainController.main );
    
    // Login
    app.get('/login/',                             loginController.loginPage );
    app.post('/login/',                            loginController.makeLogin );
    app.post('/login_rest/',                       loginController.makeLoginREST );
    app.put('/login/logout',    session.authorize, loginController.logout );
    
    // DB Server
    app.get('/table_data', session.authorize, dbServerController.getTableData);
    app.get('/view_params', session.authorize, dbServerController.getViewParams);
    app.get('/model_fields/', session.authorize,   dbServerController.modelFields);
    app.get('/record_values/',  session.authorize, dbServerController.recordValues);
    app.get('/view_record/',   session.authorize,  dbServerController.viewRecord);
    app.post('/create_item/',  session.authorize,  dbServerController.createItem);
    app.put('/save_item/',   session.authorize,    dbServerController.saveItem);
    app.get('/sources_list/',  session.authorize,  dbServerController.sourcesList);
    app.delete('/delete_item/', session.authorize, dbServerController.deleteItem);
    app.get('/combo_values/', session.authorize,   dbServerController.getComboValues);
    app.post('/db_server/upload_file',             dbServerController.uploadFile);
    app.post('/db_server/upload_blocks_kml', dbServerController.uploadBlocksKml);
    app.get('/get_query_data', session.authorize,  dbServerController.getQueryData);
    app.get('/get_table_data', session.authorize,  dbServerController.getTableQueryData);
    app.get('/time_series', session.authorize,      dbServerController.getTimeSeries);
    
    app.get('/search', session.authorize,          searchController.main);
    
    app.get('/download_excel', session.authorize,  ExcelController.downloadExcel);
    app.put('/import_from_url', session.authorize,  ExcelController.importExcelFromURL);
    
    // Users
    app.get('/user/',                session.authorize, usersController.main );
    app.get('/user/details',         session.authorize, usersController.userDetails );
    app.put('/user/change_password', session.authorize, usersController.changePassword );
    
    // Tree
    app.get('/tree/',           session.authorize, treeController.main );
    
    // TODO !autorize!
    app.get('/db_image',                                imageController.main );
    
    // all links from Angular App should be redirected to the index of the app
    // send the URL as parameter for the Angular App to make the redirection
    app.get('/app/*', function (req, res) {
        return res.redirect('/app/?url=' + encodeURIComponent(req.url));
    });
} 