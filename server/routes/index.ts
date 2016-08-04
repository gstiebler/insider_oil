"use strict";
 
import session = require('../lib/session');
import * as loginController from '../controllers/loginController';
import dbServerController = require('../controllers/dbServerController');
import * as usersController from '../controllers/usersController';
import * as searchController from '../controllers/SearchController';
import ExcelController = require('../controllers/ExcelController');
import * as imageController from '../controllers/ImageController';
import express = require("express");
import * as ni from '../../common/NetworkInterfaces';
import * as AdminController from '../controllers/AdminController';
import * as MapsController from '../controllers/MapsController';
import * as InsightsController from '../controllers/InsightsController';

module.exports = function(app: express.Express) {    
    
    app.get('/', function (req, res) {
        return res.redirect('/login');
    });
    // Login
    app.get('/login/',                             loginController.loginPage );
    app.post('/login/',                            loginController.makeLogin );
    app.post('/login_rest/',                       loginController.makeLoginREST );
    app.put('/login/logout',    session.authorize, loginController.logout );
    
    app.get('/table_data', session.authorize, AdminController.getTableData);
    app.get('/view_params', session.authorize, AdminController.getViewParams);
    app.get('/model_fields/', session.authorize,   AdminController.modelFields);
    app.get('/record_values/',  session.authorize, AdminController.recordValues);
    app.post('/create_item/',  session.authorize,  AdminController.createItem);
    app.put('/save_item/',   session.authorize,    AdminController.saveItem);
    app.get('/sources_list/',  session.authorize,  AdminController.sourcesList);
    app.delete('/delete_item/', session.authorize, AdminController.deleteItem);
    app.get('/combo_values/', session.authorize,   AdminController.getComboValues);
    app.post('/db_server/upload_kml', AdminController.uploadKml);
    
    app.post('/db_server/upload_file',             ExcelController.uploadFile);
    app.get('/download_excel', session.authorize,  ExcelController.downloadExcel);
    app.put('/import_from_url', session.authorize,  ExcelController.importExcelFromURL);

    app.post('/send_error_report', session.authorize, dbServerController.sendErrorReport);
    app.get('/get_query_data', session.authorize,  dbServerController.getQueryData);
    app.get('/get_table_data', session.authorize,  dbServerController.getTableQueryData);
    app.get('/time_series', session.authorize,     dbServerController.getTimeSeries);
    app.get('/view_record/',   session.authorize,  dbServerController.viewRecord);
    app.get('/get_record/',   session.authorize,  dbServerController.getRecord);
    app.get('/dashboard_data/',  session.authorize, dbServerController.getDashboardData);
    app.get('/queries_fields',  session.authorize, dbServerController.getTableQueriesFields);

    app.get('/maps/blocks', session.authorize,     MapsController.getBlocks);
    app.get('/maps/oil_fields', session.authorize, MapsController.getOilFields);
    app.get('/maps/production_units', session.authorize, MapsController.getProductionUnits);

    app.get('/insights', session.authorize, InsightsController.getInsights);
    
    app.get('/search', session.authorize,          searchController.main);
    
    // Users
    app.get('/user/',                session.authorize, usersController.main );
    app.get('/user/details',         session.authorize, usersController.userDetails );
    app.put('/user/change_password', session.authorize, usersController.changePassword );
    
    // TODO !autorize!
    app.get('/db_image',                                imageController.main );
    
    app.get('/s3/images/*', function (req, res) {
        const parts = req.url.split('/');
        return res.redirect('https://s3-sa-east-1.amazonaws.com/insider-oil/images/' + parts.pop() );
    });

    // all links from React App should be redirected to the index of the app
    // send the URL as parameter for the React App to make the redirection
    app.get('/app/*', function (req, res) {
        return res.redirect('/app/?url=' + encodeURIComponent(req.url));
    });
} 