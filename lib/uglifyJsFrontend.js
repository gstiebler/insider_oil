var UglifyJS = require('uglify-js');
var fs = require('fs');
var winston = require('winston');

exports.uglifyAngularJsFiles = function() {
    var result = UglifyJS.minify('client/angular-app/controllers/ModelViewCtrl.js', {
        mangle: true,
        compress: {
            sequences: true,
            dead_code: true,
            conditionals: true,
            booleans: true,
            unused: true,
            if_return: true,
            join_vars: true,
            drop_console: true
        }
    });

    const outputFilePath = __dirname + '/../client/angular-app/uglified.js';
    fs.writeFile(outputFilePath, result.code, function(err) {
        if(err) {
            winston.error('Cannot save uglified file', err.stack);
        } else {
            console.log("The file was saved!");
        }
    });
}