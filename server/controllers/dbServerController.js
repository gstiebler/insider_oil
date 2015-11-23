var db  = require('../db/models');
var tableViewParams = require('../lib/tableViewParams');
var fileUpload = require('../lib/fileUpload');

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
    fileUpload.receive( req, onFile, onFinish );

    function onFile(fileName, buf) {
        console.log( "File name: " + fileName );
        console.log( "Buffer length: " + buf.length); 
    }
    
    function onFinish() {
        console.log('Done parsing form!');
        res.json( { msg:"OK" } );
    };
}