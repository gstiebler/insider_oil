var UglifyJS = require('uglify-js');
var fs = require('fs');
var winston = require('winston');

exports.uglifyAngularJsFiles = function() {
    const jsFilesList = [
        'app.js',
        'controllers/MainCtrl.js',
        'controllers/ModelViewCtrl.js',
        'controllers/CreateItemCtrl.js',
        'controllers/EditItemCtrl.js',
        'controllers/EditNewsCtrl.js',
        'controllers/ViewRecordCtrl.js',
        'controllers/AdminSourcesListCtrl.js',
        'controllers/TreeCtrl.js',
        'controllers/MapController.js',
        'controllers/ChartController.js',
        'controllers/ChangePasswordCtrl.js',
        'appRoutes.js',
        'services/session.js',
        'services/server.js',
        'services/showError.js',
        'services/ModelOperations.js',
        'services/ModelViewService.js',
        'directives/ReadFile.js',
        'directives/ListOfInputsDirective.js',
        'directives/ListOfProjectsDirective.js',
        'directives/PhotoBytesArray.js',
        'directives/ProjectSearchDirective.js',
        'directives/EditRecordFieldsDirective.js'
    ];
    /*for(var i = 0; i < jsFilesList.length; i++) {
        jsFilesList[i] = __dirname + '/../client/angular-app/' + jsFilesList[i];
    }*/
    
    
    const outSourceMapName = 'out.js.map';
    const outSourceMapFile = __dirname + '/../client/angular-app/' + outSourceMapName;
    const minifyOptions = {
        mangle: true,
        outSourceMap: "/app/" + outSourceMapName,
        sourceRoot: 'http://localhost:3000/app/',
        compress: {
            sequences: true,
            dead_code: true,
            conditionals: true,
            booleans: true,
            unused: true,
            if_return: true,
            join_vars: true,
            drop_console: true,
        }
    };
    try {
        process.chdir(__dirname + '/../client/angular-app/');
        var result = UglifyJS.minify(jsFilesList, minifyOptions);
        process.chdir(__dirname + '/../');

        const outputFilePath = __dirname + '/../client/angular-app/minified.js';
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
    
}