var db  = require('../db/models');
var tableViewParams = require('../lib/tableViewParams');
var fileUpload = require('../lib/fileUpload');
var importExcel = require('../lib/importExcel');

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
        var model = req.query.table;
        importExcel(buf, model, onOk, onError);
        
        function onOk(status) {
            res.json( { status: status } );
        }
        
        function onError(err) {
            res.json( { errorMsg: err } );
        }
    }
      
    function onFinish() {
        console.log('Done parsing form!');
    };
}