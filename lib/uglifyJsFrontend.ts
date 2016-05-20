'use strict';
var UglifyJS = require('uglify-js');
var fs = require('fs');
var winston = require('winston');

exports.uglifyAngularJsFiles = function(env) {
    const jsFilesList = [
        'app.js',
        'appRoutes.js',
        'services/session.js',
        'services/server.js',
        'services/showError.js',
        'services/ModelOperations.js',
        'services/ModelViewService.js',
        'services/DateService.js',
        'directives/ReadFile.js',
        'directives/ListOfInputsDirective.js',
        'directives/ListOfProjectsDirective.js',
        'directives/PhotoBytesArray.js',
        'directives/ProjectSearchDirective.js',
        'directives/EditRecordFieldsDirective.js',
        'directives/ShowQueryDataDirective.js',
        'directives/ManyToManyDirective.js',
        'directives/PaginatedTable.js',
        'directives/PaginatedTableHeaderDirective.js',
        'directives/UploadExcelFileDirective.js',
        'directives/RecordViewDirective.js',
        'directives/ObjectNewsDirective.js',
        'directives/TimeSeriesChartDirective.js',
        'controllers/MainCtrl.js',
        'controllers/ModelViewCtrl.js',
        'controllers/CreateItemCtrl.js',
        'controllers/EditItemCtrl.js',
        'controllers/EditNewsCtrl.js',
        'controllers/ViewRecordCtrl.js',
        'controllers/AdminSourcesListCtrl.js',
        'controllers/TreeCtrl.js',
        'controllers/MapController.js',
        'controllers/ChangePasswordCtrl.js',
        'controllers/OilFieldCtrl.js',
    ];
    
    const angularAppPath = __dirname + '/../../client/angular-app/';
    var includeJsHtml = '';
    if(env == 'development') {
        for(var jsFile of jsFilesList) {
            const includeJsFile = '\t<script src="app/' + jsFile + '"></script>';
            includeJsHtml += includeJsFile + '\n';
        }
    } else {
        const outSourceMapName = 'out.js.map';
        const outSourceMapFile = angularAppPath + outSourceMapName;
        const minifyOptions:any = {
            mangle: true,
            compress: {
                sequences: true,
                dead_code: true,
                conditionals: true,
                booleans: true,
                unused: true,
                if_return: true,
                join_vars: true
            }
        };
        
        if(env == 'development') {
            minifyOptions.outSourceMap = "/app/" + outSourceMapName;
            minifyOptions.sourceRoot = 'http://localhost:3000/app/';
        } else {
            minifyOptions.compress.drop_console = true;
        }
        
        try {
            process.chdir(angularAppPath);
            var result = UglifyJS.minify(jsFilesList, minifyOptions);
            process.chdir(__dirname + '/../');

            const outputFilePath = angularAppPath + '/minified.js';
            fs.writeFile(outputFilePath, result.code, function(err) {
                if(err) {
                    winston.error('Cannot save minified file', err.stack);
                } else {
                    winston.info("Minified file saved");
                }
            });  
            
            fs.writeFile(outSourceMapFile, result.map, function(err) {
                if(err) {
                    winston.error('Cannot save map file', err.stack);
                } else {
                    console.log("Source map saved");
                }
            });  
        } catch(error) {
            winston.error(error);
        }
        includeJsHtml = '<script src="app/minified.js"></script>';
    }
    
    const indexPreHTMLFileName = angularAppPath + 'templates/index.pre.html';
    const indexPreContent = fs.readFileSync(indexPreHTMLFileName, 'utf8');
    const indexHTMLContent = indexPreContent.replace('{{JS_FILES_INCLUDE}}', includeJsHtml);
    const indexHTMLFileName = angularAppPath + 'templates/index.html';
    fs.writeFileSync(indexHTMLFileName, indexHTMLContent, 'utf8');
}