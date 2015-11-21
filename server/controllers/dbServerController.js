var db  = require('../db/models');
var tableViewParams = require('../lib/tableViewParams');

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