var db  = require('../db/models');
var tableViewParams = require('../lib/tableViewParams');
var fileUpload = require('../lib/fileUpload');
var XLSX = require('xlsx');

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
        var workbook = XLSX.read(buf, {type:"buffer"});
        
        var first_sheet_name = workbook.SheetNames[0];
        var address_of_cell = 'A1';

        /* Get worksheet */
        var worksheet = workbook.Sheets[first_sheet_name];

        /* Find desired cell */
        var desired_cell = worksheet[address_of_cell];

        /* Get the value */
        var desired_value = desired_cell.v;
        
        console.log(desired_value);
        
        console.log(worksheet['F1']);
        console.log(worksheet['H1']);
        
        for (z in worksheet) {
            /* all keys that do not begin with "!" correspond to cell addresses */
            if(z[0] === '!') continue;
            console.log("!" + z + "=" + JSON.stringify(worksheet[z].v));
          }
    }
    
    function onFinish() {
        console.log('Done parsing form!');
        res.json( { msg:"OK" } );
    };
}