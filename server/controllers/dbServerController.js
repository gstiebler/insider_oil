var db  = require('../db/models');
var tableViewParams = require('../lib/tableViewParams');
var Busboy = require('busboy');

exports.main = function(req, res, next) {
    var model = req.query.table;
    db[model].findAll().then(sendRecords);
    
    function sendRecords(records) {
        var viewParams = tableViewParams[model]();
        var responseObj = {
            records: records,
            viewParams: viewParams
        };
        res.json( responseObj );
    }
}


exports.uploadFile = function(req, res, next) {
    var busboy = new Busboy({ headers: req.headers });
    
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      
        file.on('data', function(data) {
            console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
        });
      
        file.on('end', function() {
            console.log('File [' + fieldname + '] Finished');
        });
    });
    
    busboy.on('finish', function() {
        console.log('Done parsing form!');
        res.json( { msg:"OK" } );
    });
    
    req.pipe(busboy);
}