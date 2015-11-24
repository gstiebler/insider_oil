var XLSX = require('xlsx');
var db = require( '../db/models' );

function getHeader(worksheet) {
    var header = [];
    var range = XLSX.utils.decode_range(worksheet['!ref']);
    var firstCol = range.s.c;
    var lastCol = range.e.c;
    for( var col = firstCol; col < lastCol; col++ ) {
        var cellAddress = XLSX.utils.encode_cell({r: 0, c: col});
        header.push( worksheet[cellAddress].v );
    }
    
    return header;
}


module.exports = function(excelBuf) {
    console.log( "Buffer length: " + excelBuf.length); 
    var workbook = XLSX.read(excelBuf, {type:"buffer"});
    
    var first_sheet_name = workbook.SheetNames[0];

    /* Get worksheet */
    var worksheet = workbook.Sheets[first_sheet_name];
    
    var header = getHeader(worksheet);
    console.log(header);
}